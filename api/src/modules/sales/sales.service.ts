import { Buyer } from '@/entities/buyer.entity';
import { Order } from '@/entities/order.entity';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../event/event.service';
import { OpenPixService } from '../shared/services/openpix.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
    private eventService: EventService,
    private openPixService: OpenPixService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const event = await this.eventService.getById(createOrderDto.eventId);

    if (event.limit_time_for_ticket_purchase < new Date()) {
      throw new ForbiddenException('Ticket purchase time expired');
    }

    const buyer = await this.buyersRepository.save(createOrderDto.buyer);

    createOrderDto.eventId = undefined;

    const pixCharge = await this.openPixService.generatePixCharge(
      event.price * 100,
    );

    if (pixCharge === false) {
      throw new InternalServerErrorException('Error generating pix charge');
    }

    await this.ordersRepository.save({
      ...createOrderDto,
      value: event.price,
      transaction_reference: pixCharge.data.correlationID,
      event,
      buyer,
    });

    return {
      transactionReference: pixCharge.data.correlationID,
      qrcodeImageUrl: pixCharge.data.charge.qrCodeImage,
      pixCopyPaste: pixCharge.data.brCode,
      value: pixCharge.data.charge.value,
      expiresDate: pixCharge.data.charge.expiresDate,
    };
  }

  async getEventOrders(eventId: string, userId: string) {
    await this.eventService.getById(eventId, userId);

    const orders = await this.ordersRepository.find({
      where: {
        event: {
          id: eventId,
        },
      },
    });

    if (!orders.length) throw new NotFoundException();

    return orders;
  }
}

import { OpenPixService } from './openpix.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { Buyer } from 'src/database/typeorm/entities/buyer.entity';
import { Order } from 'src/database/typeorm/entities/order.entity';
import { Payment } from 'src/database/typeorm/entities/payment.entity';
import { Ticket } from 'src/database/typeorm/entities/ticket.entity';
import { Repository } from 'typeorm';
import { EventService } from '../../event/event.service';
import { PaymentMethods } from '../../shared/enums/payment-methods.enum';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { CreateOrderDto } from '../dto/create-order.dto';
import { PixWebhookBody } from '../dto/pix-webhook-body.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private eventService: EventService,
    private openPixService: OpenPixService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const event = await this.eventService.getById(createOrderDto.eventId);

    const buyer = await this.buyersRepository.save(createOrderDto.buyer);

    createOrderDto.eventId = undefined;

    const pixCharge = await this.openPixService.generatePixCharge(event.price);

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

  async webhookPix(body: PixWebhookBody) {
    if (body.status === PaymentStatus.PAID) {
      const order = await this.ordersRepository.findOne({
        where: {
          transaction_reference: body.transaction_id,
        },
        relations: {
          event: true,
        },
      });

      await this.paymentsRepository.save({
        method: PaymentMethods.PIX,
        transaction_reference: body.transaction_id,
        status: PaymentStatus.PAID,
        order: order,
        value: body.value,
      });

      await this.ticketsRepository.save({
        event: order.event,
        order: order,
      });

      //Send ticker by email
    }
    return true;
  }
}
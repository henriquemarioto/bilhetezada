import { Buyer } from '@/entities/buyer.entity';
import { Order } from '@/entities/order.entity';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from '../event/event.service';
import { PaymentService } from '../payment/services/payment.service';
import { PaymentMethods } from '../shared/enums/payment-methods.enum';
import { CreateTicketOrderDto } from './dto/create-ticket-order.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
    private eventService: EventService,
    @Inject('PaymentService') private paymentService: PaymentService,
  ) {}

  async createTicketOrder(createTicketOrderDto: CreateTicketOrderDto): Promise<{
    transactionId: string;
    qrcodeImageUrl: string;
    pixCopyPaste: string;
    value: number;
    expiresDate: string;
  }> {
    const event = await this.eventService.getById(createTicketOrderDto.eventId);

    if (event.limit_time_for_ticket_purchase < new Date()) {
      throw new ForbiddenException('Ticket purchase time expired');
    }

    const buyer = await this.buyersRepository.save(createTicketOrderDto.buyer);

    const pixCharge = await this.paymentService.generateCharge(
      event.price,
      PaymentMethods.PIX,
    );

    const { eventId: _, ...createOrderData } = createTicketOrderDto;

    await this.ordersRepository.save({
      ...createOrderData,
      value: event.price,
      transaction_reference: pixCharge.transactionId,
      event,
      buyer,
    });

    return {
      transactionId: pixCharge.transactionId,
      qrcodeImageUrl: pixCharge.qrcodeImageUrl,
      pixCopyPaste: pixCharge.pixCopyPaste,
      value: pixCharge.value,
      expiresDate: pixCharge.expiresDate,
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from 'src/database/typeorm/entities/buyer.entity';
import { Order } from 'src/database/typeorm/entities/order.entity';
import { Payment } from 'src/database/typeorm/entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventService } from '../event/event.service';
import { PaymentMethods } from '../shared/enums/payment-methods.enum';
import { PaymentStatus } from '../shared/enums/payment-status.enum';
import { Ticket } from 'src/database/typeorm/entities/ticket.entity';
import { PixWebhookBody } from './dto/pix-webhook-body.dto';
import { randomInt } from 'crypto';

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
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const event = await this.eventService.getById(createOrderDto.eventId);

    const buyer = await this.buyersRepository.save(createOrderDto.buyer);

    createOrderDto.eventId = undefined;

    //Get pix for payment
    const pixData = {
      transactionReference: String(randomInt(9999)),
      qrCodeBase64: 'aaaaaaaaaaaaaaaaaaaaa',
      copyPaste: 'aaaaaaaaaaaaaaaaaaaaa',
    };

    await this.ordersRepository.save({
      ...createOrderDto,
      transaction_reference: pixData.transactionReference,
      event,
      buyer,
    });

    return {
      pixQRCodeBase64: pixData.qrCodeBase64,
      pixCopyPaste: pixData.copyPaste,
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

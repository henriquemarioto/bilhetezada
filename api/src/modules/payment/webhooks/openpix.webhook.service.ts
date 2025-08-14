import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { OpenPixPixWebhookBodyDto } from '../dto/openpix-pix-webhook-body.dto';
import OpenPixChargeStatus from '@/modules/shared/enums/openpix-charge-status.enum';
import { WebhookInterface } from './interfaces/webhook.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/entities/order.entity';
import { Payment } from '@/entities/payment.entity';
import { Ticket } from '@/entities/ticket.entity';
import { PaymentMethods } from '@/modules/shared/enums/payment-methods.enum';
import { PaymentStatus } from '@/modules/shared/enums/payment-status.enum';
import { OrderStatus } from '@/modules/shared/enums/order-status.enum';
import { NotificationDispatcher } from '@/modules/notification/notification.dispatcher';

@Injectable()
export class OpenPixWebhookService implements WebhookInterface {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly notificationDispatcher: NotificationDispatcher,
  ) {}

  async handleWebhook(body: OpenPixPixWebhookBodyDto): Promise<boolean> {
    if (body.charge.status === OpenPixChargeStatus.COMPLETED) {
      const order = await this.ordersRepository.findOne({
        where: {
          transaction_reference: body.charge.correlationID,
        },
        relations: {
          event: true,
          buyer: true,
        },
      });

      if (!order) {
        throw new InternalServerErrorException(
          'Order not found for webhook processment',
        );
      }

      await this.paymentsRepository.save({
        method: PaymentMethods.PIX,
        transaction_reference: body.charge.correlationID,
        status: PaymentStatus.PAID,
        order: order,
        value: body.pix.value,
      });

      await this.ordersRepository.update(order.id, {
        status: OrderStatus.CONFIRMED,
      });

      await this.ticketsRepository.save({
        event: order.event,
        order: order,
      });

      if (!order.buyer) {
        throw new InternalServerErrorException('Buyer has no email');
      }

      await this.notificationDispatcher.notify(
        'email',
        order.buyer?.email,
        '',
        {
          subject: 'Ingresso do evento ' + order.event?.name,
        },
      );
    }
    return true;
  }
}

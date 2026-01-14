import { PaymentConfirmedEvent } from '@/modules/payment/domain-events/payment-confirmed.event';
import { OrderStatus } from '@/shared/enums/order-status.enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SalesService } from '../services/sales.service';

@Injectable()
export class OnPaymentConfirmedListener {
  constructor(private readonly salesService: SalesService) {}

  @OnEvent('payment.approved')
  async handle(domainEvent: PaymentConfirmedEvent) {
    await this.salesService.updateOrderStatus(
      domainEvent.orderId,
      OrderStatus.CONFIRMED,
    );
  }
}

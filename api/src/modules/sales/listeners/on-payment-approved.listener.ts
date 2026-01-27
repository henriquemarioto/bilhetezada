import { FailedEventService } from '@/infrastructure/observability/event-failure/services/failed-event.service';
import { PaymentApprovedEvent } from '@/modules/payment/domain-events/payment-approved.event';
import { OrderStatus } from '@/shared/enums/order-status.enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SalesService } from '../services/sales.service';

@Injectable()
export class OnPaymentConfirmedListener {
  constructor(
    private readonly salesService: SalesService,
    private readonly failedEventService: FailedEventService,
  ) {}

  @OnEvent('payment.approved')
  async handle(domainEvent: PaymentApprovedEvent) {
    try {
      await this.salesService.updateOrderStatus(
        domainEvent.orderId,
        OrderStatus.CONFIRMED,
      );
    } catch (error) {
      await this.failedEventService.registerFailure(
        'payment.approved',
        'OnPaymentConfirmedListener',
        { orderId: domainEvent.orderId, status: OrderStatus.CONFIRMED },
        error,
      );
    }
  }
}

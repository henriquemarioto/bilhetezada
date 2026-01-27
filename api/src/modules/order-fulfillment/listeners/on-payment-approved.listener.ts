import { FailedEventService } from '@/infrastructure/observability/event-failure/services/failed-event.service';
import { PaymentApprovedEvent } from '@/modules/payment/domain-events/payment-approved.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GenerateTicketsOnPaymentApprovedUseCase } from '../use-cases/generate-tickets-on-payment-approved.use-case';

@Injectable()
export class OnPaymentApprovedListener {
  constructor(
    private readonly generateTicketsOnPaymentApprovedUseCase: GenerateTicketsOnPaymentApprovedUseCase,
    private readonly failedEventService: FailedEventService,
  ) {}

  @OnEvent('payment.approved')
  async handle(domainEvent: PaymentApprovedEvent) {
    try {
      await this.generateTicketsOnPaymentApprovedUseCase.execute(domainEvent.orderId);
    } catch (error) {
      await this.failedEventService.registerFailure(
        'payment.approved',
        'OnPaymentApprovedListener',
        { orderId: domainEvent.orderId },
        error,
      );
    }
  }
}

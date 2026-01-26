import { PaymentApprovedEvent } from '@/modules/payment/domain-events/payment-approved.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GenerateTicketsOnPaymentApprovedUseCase } from '../use-cases/generate-tickets-on-payment-approved.use-case';

@Injectable()
export class OnPaymentApprovedListener {
  constructor(
    private readonly generateTicketsOnPaymentApprovedUseCase: GenerateTicketsOnPaymentApprovedUseCase,
  ) {}

  @OnEvent('payment.approved')
  handle(domainEvent: PaymentApprovedEvent) {
    this.generateTicketsOnPaymentApprovedUseCase.execute(domainEvent.orderId);
  }
}

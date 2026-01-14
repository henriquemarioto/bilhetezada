import { PaymentConfirmedEvent } from '@/modules/payment/domain-events/payment-confirmed.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GenerateTicketsOnPaymentConfirmedUseCase } from '../use-cases/generate-tickets-on-payment-confirmed.use-case';

@Injectable()
export class OnPaymentConfirmedListener {
  constructor(
    private readonly generateTicketsOnPaymentConfirmedUseCase: GenerateTicketsOnPaymentConfirmedUseCase,
  ) {}

  @OnEvent('payment.approved')
  async handle(domainEvent: PaymentConfirmedEvent) {
    await this.generateTicketsOnPaymentConfirmedUseCase.execute(domainEvent.orderId);
  }
}

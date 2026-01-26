import { TicketsCreatedEvent } from '@/modules/order-fulfillment/domain-events/tickets-created.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotifyCreatedTicketsUseCase } from '../use-cases/notify-created-tickets.use-case';

@Injectable()
export class OnTicketsCreatedListener {
  constructor(
    private readonly notifyCreatedTicketsUseCase: NotifyCreatedTicketsUseCase,
  ) {}

  @OnEvent('tickets.created')
  handle(domainEvent: TicketsCreatedEvent) {
    this.notifyCreatedTicketsUseCase.execute(domainEvent);
  }
}

import { FailedEventService } from '@/infrastructure/observability/event-failure/services/failed-event.service';
import { TicketsCreatedEvent } from '@/modules/order-fulfillment/domain-events/tickets-created.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotifyCreatedTicketsUseCase } from '../use-cases/notify-created-tickets.use-case';

@Injectable()
export class OnTicketsCreatedListener {
  constructor(
    private readonly notifyCreatedTicketsUseCase: NotifyCreatedTicketsUseCase,
    private readonly failedEventService: FailedEventService,
  ) {}

  @OnEvent('tickets.created')
  async handle(domainEvent: TicketsCreatedEvent) {
    try {
      await this.notifyCreatedTicketsUseCase.execute(domainEvent);
    } catch (error) {
      await this.failedEventService.registerFailure(
        'tickets.created',
        'OnTicketsCreatedListener',
        { orderId: domainEvent.orderId, ticketIds: domainEvent.ticketIds },
        error,
      );
    }
  }
}

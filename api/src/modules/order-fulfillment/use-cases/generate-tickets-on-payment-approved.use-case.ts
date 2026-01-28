import { EventService } from '@/modules/event/services/event.service';
import { SalesService } from '@/modules/sales/services/sales.service';
import { TicketService } from '@/modules/ticket/ticket.service';
import { Inject, Injectable } from '@nestjs/common';
import { TicketsCreatedEvent } from '../domain-events/tickets-created.event';
import { EventEmitterService } from '@/modules/shared/services/event-emitter.service';
import { Logger } from '@/core/logger/logger.interface';
import { LOGGER } from '@/core/logger/logger.tokens';

@Injectable()
export class GenerateTicketsOnPaymentApprovedUseCase {
  private readonly logger: Logger;

  constructor(
    private readonly ticketService: TicketService,
    private readonly salesService: SalesService,
    private readonly eventService: EventService,
    private readonly eventEmitterService: EventEmitterService,
    @Inject(LOGGER)
    baseLogger: Logger,
  ) {
    this.logger = baseLogger.withContext(
      GenerateTicketsOnPaymentApprovedUseCase.name,
    );
  }

  async execute(orderId: string): Promise<boolean> {
    const order = await this.salesService.getOrderById(orderId, ['buyer']);

    if (!order) {
      this.logger.error('Order not found for create tickets', { orderId });
      throw new Error(`Order not found to create tickets, orderId: ${orderId}`);
    }

    if (!order.buyer) {
      this.logger.error('Buyer not found for create tickets', { orderId });
      throw new Error(
        `Buyer not found to create tickets, orderId: ${orderId}`,
      );
    }
    
    const orderItems = await this.salesService.getOrderItemsByOrderId(orderId);

    if (!orderItems.length) {
      this.logger.error(
        `Order items not found for create tickets`,
        { orderId },
      );
      throw new Error(
        `Order items not found to create tickets, orderId: ${orderId}`,
      );
    }

    const event = await this.eventService.getById(order.event_id);

    if (!event) {
      this.logger.error(
        `Event not found for create tickets, eventId: ${order.event_id}, orderId: ${orderId}`,
      );
      throw new Error(
        `Event not found to create tickets, eventId: ${order.event_id}, orderId: ${orderId}`,
      );
    }

    const ticketsIds: string[] = [];

    await Promise.all(
      orderItems.map(async (item) => {
        this.logger.info(
          `Creating tickets for order item ${item.id}, tickets quantity ${item.ticket_quantity}.`,
        );

        if (item.ticket_quantity <= 0) {
          this.logger.error(
            `Skipping ticket creation for order item ${item.id} as ticket quantity is ${item.ticket_quantity}.`,
            { orderId, orderItemId: item.id },
          );
          return;
        }

        const tickets = await this.ticketService.createManyTickets(
          item.id,
          item.batch_id,
          item.ticket_quantity,
        );

        ticketsIds.push(...tickets.map((ticket) => ticket.id));
      }),
    );

    this.eventEmitterService.emitAsync(
      'tickets.created',
      new TicketsCreatedEvent(
        event.id,
        event.name,
        orderId,
        ticketsIds,
        order.buyer.id,
        order.buyer.phone,
      ),
    );

    return true;
  }
}

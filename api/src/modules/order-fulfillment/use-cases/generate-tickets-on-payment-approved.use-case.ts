import { EventService } from '@/modules/event/services/event.service';
import { SalesService } from '@/modules/sales/services/sales.service';
import { TicketService } from '@/modules/ticket/ticket.service';
import { Injectable } from '@nestjs/common';
import { TicketsCreatedEvent } from '../domain-events/tickets-created.event';
import { EventEmitterService } from '@/modules/shared/services/event-emitter.service';

@Injectable()
export class GenerateTicketsOnPaymentApprovedUseCase {
  constructor(
    private readonly ticketService: TicketService,
    private readonly salesService: SalesService,
    private readonly eventService: EventService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async execute(orderId: string): Promise<boolean> {
    console.log(
      'Payment approved event received for create tickets',
      JSON.stringify(orderId),
    );

    const order = await this.salesService.getOrderById(orderId, ['buyer']);

    if (!order) {
      console.error('Order not found for create tickets', orderId);
      throw new Error(`Order not found to create tickets, orderId: ${orderId}`);
    }

    if (!order.buyer) {
      console.error(
        `Buyer not found for create tickets, orderId: ${orderId}`,
      );
      throw new Error(
        `Buyer not found to create tickets, orderId: ${orderId}`,
      );
    }

    const orderItems = await this.salesService.getOrderItemsByOrderId(orderId);

    if (!orderItems.length) {
      console.error(
        `Order items not found for create tickets, orderId: ${orderId}`,
        orderId,
      );
      throw new Error(
        `Order items not found to create tickets, orderId: ${orderId}`,
      );
    }

    console.log(
      `Creating tickets for order ${orderId} with ${orderItems.length} order items.`,
    );

    const event = await this.eventService.getById(order.event_id);

    if (!event) {
      console.error(
        `Event not found for create tickets, eventId: ${order.event_id}, orderId: ${orderId}`,
      );
      throw new Error(
        `Event not found to create tickets, eventId: ${order.event_id}, orderId: ${orderId}`,
      );
    }

    const ticketsIds: string[] = [];

    await Promise.all(
      orderItems.map(async (item) => {
        console.log(
          `Creating ticket for order item ${item.id}, tickets quantity ${item.ticket_quantity}.`,
        );

        if (item.ticket_quantity <= 0) {
          console.log(
            `Skipping ticket creation for order item ${item.id} as ticket quantity is ${item.ticket_quantity}.`,
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

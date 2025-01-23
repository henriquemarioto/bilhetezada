import { Event } from '@/entities/event.entity';
import { Order } from '@/entities/order.entity';
import { Ticket } from '@/entities/ticket.entity';
import { faker } from '@faker-js/faker/.';

type TicketFactoryProps = {
  event: Event;
  order: Order;
  used?: boolean;
};

export const ticketFactory = ({
  event,
  order,
  used = false,
}: TicketFactoryProps): Ticket => ({
  id: faker.string.uuid(),
  event: event,
  order: order,
  used: used,
  created_at: new Date(),
  updated_at: new Date(),
});

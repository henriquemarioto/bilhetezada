import { OrderItem } from '@/modules/sales/entities/order-item.entity';
import { TicketBatch } from '@/modules/ticket/entities/ticket-batch.entity';
import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import { faker } from '@faker-js/faker/.';

type TicketFactoryProps = {
  ticketbatch: TicketBatch;
  orderItem: OrderItem;
  used?: boolean;
};

export const ticketFactory = ({
  ticketbatch,
  orderItem,
  used = false,
}: TicketFactoryProps): Ticket => ({
  id: faker.string.uuid(),
  order_item: orderItem,
  ticket_batch: ticketbatch,
  used: used,
  ticket_batch_id: ticketbatch.id,
  order_item_id: orderItem.id,
  created_at: new Date(),
  updated_at: new Date(),
});

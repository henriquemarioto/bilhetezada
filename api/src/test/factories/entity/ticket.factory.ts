import { OrderItem } from '@/modules/sales/entities/order-item.entity';
import { Batch } from '@/modules/ticket/entities/batch.entity';
import { TicketType } from '@/modules/ticket/entities/ticket-type.entity';
import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import { faker } from '@faker-js/faker/.';

type TicketFactoryProps = {
  batch: Batch;
  ticketType: TicketType;
  orderItem: OrderItem;
  used?: boolean;
};

export const ticketFactory = ({
  batch,
  ticketType,
  orderItem,
  used = false,
}: TicketFactoryProps): Ticket => ({
  id: faker.string.uuid(),
  order_item: orderItem,
  used: used,
  batch: batch,
  batch_id: batch.id,
  ticket_type: ticketType,
  ticket_type_id: ticketType.id,
  order_item_id: orderItem.id,
  created_at: new Date(),
  updated_at: new Date(),
});

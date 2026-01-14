import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import { faker } from '@faker-js/faker/.';
import { Batch } from '@/modules/event/entities/batch.entity';
import { OrderItem } from '@/modules/sales/entities/order-item.entity';

type TicketFactoryProps = {
  batch: Batch;
  orderItem: OrderItem;
  used?: boolean;
};

export const ticketFactory = ({
  batch,
  orderItem,
  used = false,
}: TicketFactoryProps): Ticket => ({
  id: faker.string.uuid(),
  order_item: orderItem,
  batch: batch,
  used: used,
  batch_id: batch.id,
  order_item_id: orderItem.id,
  created_at: new Date(),
  updated_at: new Date(),
});

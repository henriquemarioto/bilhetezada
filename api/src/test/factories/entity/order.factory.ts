import { Event } from '@/modules/event/entities/event.entity';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { Buyer } from '@/modules/sales/entities/buyer.entity';
import { Order } from '@/modules/sales/entities/order.entity';
import { Batch } from '@/modules/ticket/entities/batch.entity';
import { OrderStatus } from '@/shared/enums/order-status.enum';
import { faker } from '@faker-js/faker/.';

type OrderFactoryProps = {
  event: Event;
  batch: Batch;
  buyer?: Buyer | null;
  payment?: Payment | null;
  ticket_quantity: number;
  event_organizer_amount_net: number;
};

export const orderFactory = ({
  event,
  batch,
  buyer = null,
  payment = null,
  ticket_quantity,
  event_organizer_amount_net,
}: OrderFactoryProps): Order => ({
  id: faker.string.uuid(),
  buyer: buyer,
  event: event,
  payment: payment,
  status: OrderStatus.PENDING,
  event_id: event.id,
  ticket_quantity,
  total_amount: batch.amount * ticket_quantity,
  platform_fee_amount: faker.number.int({ min: 100, max: 500 }),
  gateway_fee_amount: faker.number.int({ min: 50, max: 300 }),
  event_organizer_amount_net,
  transaction_reference: faker.string.uuid(),
  order_items: [],
  created_at: new Date(),
  updated_at: new Date(),
});

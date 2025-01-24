import { Order } from '@/entities/order.entity';
import { faker } from '@faker-js/faker/.';
import { OrderStatus } from '@/modules/shared/enums/orde-status.enum';
import { Ticket } from '@/entities/ticket.entity';
import { Buyer } from '@/entities/buyer.entity';
import { Payment } from '@/entities/payment.entity';
import { Event } from '@/entities/event.entity';

type OrderFactoryProps = {
  event: Event;
  ticket?: Ticket;
  buyer?: Buyer;
  payment?: Payment;
};

export const orderFactory = ({
  event,
  ticket = null,
  buyer = null,
  payment = null,
}: OrderFactoryProps): Order => ({
  id: faker.string.uuid(),
  buyer: buyer,
  event: event,
  payment: payment,
  status: OrderStatus.PENDING,
  ticket: ticket,
  value: faker.number.int({
    min: 1000,
    max: 20000,
  }),
  transaction_reference: faker.string.uuid(),
  created_at: new Date(),
  updated_at: new Date(),
});

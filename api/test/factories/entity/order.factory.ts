import { Order } from '@/entities/order.entity';
import { faker } from '@faker-js/faker/.';
import { OrderStatus } from 'src/modules/shared/enums/orde-status.enum';
import { buyerFactory } from './entities/buyer.factory';
import { eventFactory } from './entities/event.factory';
import { paymentFactory } from './payment.factory';
import { ticketFactory } from './ticket.factory';

export const orderFactory = (): Order => ({
  id: faker.string.uuid(),
  buyer: buyerFactory(),
  event: eventFactory(),
  payment: paymentFactory(),
  status: OrderStatus.PENDING,
  ticket: ticketFactory(),
  value: faker.number.int({
    min: 1000,
    max: 20000,
  }),
  transaction_reference: faker.string.uuid(),
  created_at: new Date(),
  updated_at: new Date(),
});

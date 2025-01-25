import { Payment } from '@/entities/payment.entity';
import { faker } from '@faker-js/faker/.';
import { PaymentMethods } from 'src/modules/shared/enums/payment-methods.enum';
import { PaymentStatus } from 'src/modules/shared/enums/payment-status.enum';
import { orderFactory } from './order.factory';
import { Event } from '@/entities/event.entity';

export const paymentFactory = ({ event }: { event: Event }): Payment => ({
  id: faker.string.uuid(),
  description: '',
  method: PaymentMethods.PIX,
  order: orderFactory({ event: event }),
  status: PaymentStatus.PENDING,
  transaction_reference: faker.string.uuid(),
  value: faker.number.int(),
  created_at: new Date(),
  updated_at: new Date(),
});

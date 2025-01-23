import { Payment } from '@/entities/payment.entity';
import { faker } from '@faker-js/faker/.';
import { PaymentMethods } from 'src/modules/shared/enums/payment-methods.enum';
import { PaymentStatus } from 'src/modules/shared/enums/payment-status.enum';
import { orderFactory } from './order.factory';

export const paymentFactory = (): Payment => ({
  id: faker.string.uuid(),
  description: '',
  method: PaymentMethods.PIX,
  order: orderFactory(),
  status: PaymentStatus.PENDING,
  transaction_reference: faker.string.uuid(),
  value: faker.number.int(),
  created_at: new Date(),
  updated_at: new Date(),
});

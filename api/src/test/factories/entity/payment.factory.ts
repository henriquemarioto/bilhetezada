import { Payment } from '@/modules/payment/entities/payment.entity';
import { faker } from '@faker-js/faker/.';
import { PaymentMethods } from '@/shared/enums/payment-methods.enum';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { Order } from '@/modules/sales/entities/order.entity';
import { PaymentGateways } from '@/shared/enums/payment-gateways.enum';

export const paymentFactory = ({ order }: { order: Order }): Payment => {
  return {
    id: faker.string.uuid(),
    description: '',
    method: PaymentMethods.PIX,
    order,
    order_id: order.id,
    status: PaymentStatus.PENDING,
    transaction_reference: faker.string.uuid(),
    amount: faker.number.int(),
    gateway: PaymentGateways.WOOVI,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

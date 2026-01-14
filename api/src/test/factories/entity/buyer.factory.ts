import { Buyer } from '@/modules/sales/entities/buyer.entity';
import { Order } from '@/modules/sales/entities/order.entity';
import { faker } from '@faker-js/faker/.';

type BuyerFactoryProps = {
  order: Order;
};

export const buyerFactory = ({ order }: BuyerFactoryProps): Buyer => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  order: order,
  order_id: order.id,
  phone: String(
    faker.number.int({
      min: 11111111111,
      max: 99999999999,
    }),
  ),
  created_at: new Date(),
  updated_at: new Date(),
});

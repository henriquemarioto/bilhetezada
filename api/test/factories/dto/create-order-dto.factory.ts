import { CreateOrderDto } from '@/modules/sales/dto/create-order.dto';
import { faker } from '@faker-js/faker/.';

export const createOrderDtoFactory = (
  eventId: string = faker.string.uuid(),
): CreateOrderDto => ({
  buyer: {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    phone: String(faker.number.int({ min: 11111111111, max: 99999999999 })),
  },
  eventId: eventId,
});

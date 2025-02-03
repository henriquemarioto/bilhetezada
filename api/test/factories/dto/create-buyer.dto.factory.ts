import { CreateBuyerDto } from '@/modules/sales/dto/create-buyer.dto';
import { faker } from '@faker-js/faker/.';

export const createBuyerDtoFactory = (): CreateBuyerDto => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: '+5512912345678',
});

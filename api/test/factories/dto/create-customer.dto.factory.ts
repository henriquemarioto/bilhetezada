import { CreateCustomerDto } from '@/modules/customer/dto/create-customer.dto';
import { faker } from '@faker-js/faker/.';

export const createCustomerDtoFactory = (
  pictureUrl: boolean = false,
): CreateCustomerDto => {
  const createCustomerDto: CreateCustomerDto = {
    name: faker.person.fullName(),
    document: String(faker.number.int({ min: 11111111111, max: 99999999999 })),
    birth_date: new Date(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  if (pictureUrl) createCustomerDto.picture_url = faker.internet.url();

  return createCustomerDto;
};

import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { faker } from '@faker-js/faker/.';

export const createUserDtoFactory = (): CreateUserDto => {
  const createUserDto: CreateUserDto = {
    name: faker.person.fullName(),
    document: String(faker.number.int({ min: 11111111111, max: 99999999999 })),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return createUserDto;
};

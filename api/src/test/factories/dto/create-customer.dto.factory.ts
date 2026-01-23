import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { faker } from '@faker-js/faker/.';

export const createUserDtoFactory = (): CreateUserDto => {
  const createUserDto: CreateUserDto = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return createUserDto;
};

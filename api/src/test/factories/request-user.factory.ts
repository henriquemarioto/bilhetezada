import { faker } from '@faker-js/faker/.';
import { RequestUser } from '@/shared/dtos/request-user.dto';

export const requestUserFactory = (): RequestUser => ({
  userId: faker.string.uuid(),
  userName: faker.person.fullName(),
});

import { RequestUser } from '@/modules/shared/dto/request-user.dto';
import { faker } from '@faker-js/faker/.';

export const requestUserFactory = (): RequestUser => ({
  userId: faker.string.uuid(),
  userName: faker.person.fullName(),
});

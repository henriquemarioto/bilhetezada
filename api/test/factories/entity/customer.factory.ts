import { Customer } from '@/entities/customer.entity';
import { faker } from '@faker-js/faker/.';
import AuthProviders from '@/modules/shared/enums/auth-providers.enum';

export const customerFactory = (pictureUrl: boolean = true): Customer => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  active: true,
  auth_provider: AuthProviders.LOCAL,
  birth_date: new Date(),
  document: faker.string.alphanumeric(10),
  email: faker.string.alphanumeric(10),
  events: [],
  password: faker.string.alphanumeric(10),
  picture_url: pictureUrl ? faker.internet.url() : null,
  created_at: new Date(),
  updated_at: new Date(),
});

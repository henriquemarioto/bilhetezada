import { User } from '@/modules/user/entities/user.entity';
import { faker } from '@faker-js/faker/.';
import AuthProviders from '@/shared/enums/auth-providers.enum';

export const userFactory = (pictureUrl: boolean = true): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  active: true,
  auth_provider: AuthProviders.LOCAL,
  birth_date: new Date().toISOString(),
  document: faker.string.alphanumeric(10),
  email: faker.string.alphanumeric(10),
  email_verified: false,
  events: [],
  password: faker.string.alphanumeric(10),
  picture_url: pictureUrl ? faker.internet.url() : null,
  pix_key: faker.string.uuid(),
  withdraws: [],
  emailVerificationTokens: [],
  created_at: new Date(),
  updated_at: new Date(),
});

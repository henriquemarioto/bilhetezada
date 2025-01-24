import { CreateOrderResponseDto } from '@/modules/sales/dto/create-order-response.dto';
import { faker } from '@faker-js/faker/.';
import { randomUUID } from 'crypto';

export const createOrderResponseDtoFactory = (
  transactionReference: string = randomUUID(),
): CreateOrderResponseDto => ({
  expiresDate: new Date().toISOString(),
  pixCopyPaste: faker.string.alphanumeric(30),
  qrcodeImageUrl: faker.internet.url(),
  transactionReference: transactionReference,
  value: faker.number.int({ min: 1000, max: 30000 }),
});

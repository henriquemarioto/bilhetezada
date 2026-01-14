import { CreateTicketOrderResponseDto } from '@/modules/sales/dtos/create-ticket-order-response.dto';
import { faker } from '@faker-js/faker/.';
import { randomUUID } from 'crypto';

export const createOrderResponseDtoFactory = (
  transactionReference: string = randomUUID(),
): CreateTicketOrderResponseDto => ({
  expiresDate: new Date().toISOString(),
  pixCopyPaste: faker.string.alphanumeric(30),
  qrcodeImageUrl: faker.internet.url(),
  transactionId: transactionReference,
  value: faker.number.int({ min: 1000, max: 30000 }),
  checkoutUrl: faker.internet.url(),
});

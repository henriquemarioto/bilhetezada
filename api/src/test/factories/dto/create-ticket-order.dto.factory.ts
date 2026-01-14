import { CreateTicketOrderDto } from '@/modules/sales/dtos/create-ticket-order.dto';
import { faker } from '@faker-js/faker/.';

export const createTicketOrderDtoFactory = (
  eventId: string = faker.string.uuid(),
  batchId: string,
): CreateTicketOrderDto => ({
  buyer: {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    phone: String(faker.number.int({ min: 11111111111, max: 99999999999 })),
  },
  ticketQuantity: faker.number.int({ min: 1, max: 10 }),
  batchId: batchId,
  eventId: eventId,
});

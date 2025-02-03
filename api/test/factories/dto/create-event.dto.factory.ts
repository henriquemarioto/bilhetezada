import { faker } from '@faker-js/faker/.';
import { CreateEventDto } from '@/modules/event/dto/create-event.dto';
import { Timezones } from '@/modules/shared/enums/timezones.enum';

const startTime = new Date();
startTime.setDate(startTime.getDate() + 2);

const endTime = new Date(startTime);
endTime.setHours(endTime.getHours() + 5);

const entranceLimitTime = new Date(startTime);
entranceLimitTime.setHours(entranceLimitTime.getHours() + 3);

const limitTimeForTicketPurchase = new Date(startTime);
limitTimeForTicketPurchase.setHours(limitTimeForTicketPurchase.getHours() - 1);

export const createEventDtoFactory = (
  entranceLimit = false,
): CreateEventDto => ({
  name: faker.lorem.words(5),
  description: faker.lorem.words(20),
  address: faker.location.streetAddress(),
  price: faker.number.int({ min: 10, max: 10000 }),
  start_time: startTime.toISOString(),
  end_time: endTime.toISOString(),
  limit_time_for_ticket_purchase: limitTimeForTicketPurchase.toISOString(),
  entrance_limit_time: entranceLimit ? entranceLimitTime.toISOString() : null,
  time_zone: Timezones.AMERICA_SAO_PAULO,
});

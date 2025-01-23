import { faker } from '@faker-js/faker/.';
import { CreateEventDto } from '@/modules/event/dto/create-event.dto';
import { Timezones } from '@/modules/shared/enums/timezones.enum';

export const createEventDtoFactory = (): CreateEventDto => ({
  address: faker.location.streetAddress(),
  description: faker.lorem.words(20),
  name: faker.lorem.words(5),
  price: 2000,
  limit_time_for_ticket_purchase: new Date().toISOString(),
  start_time: new Date().toISOString(),
  end_time: new Date().toISOString(),
  time_zone: Timezones.AMERICA_SAO_PAULO,
  entrance_limit_time: null,
});

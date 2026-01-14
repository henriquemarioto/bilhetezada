import { CreateEventDto } from '@/modules/event/dtos/create-event.dto';
import { faker } from '@faker-js/faker/.';
import { Timezones } from '@/shared/enums/timezones.enum';

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
  start_time: startTime.toISOString(),
  end_time: endTime.toISOString(),
  entrance_limit_time: entranceLimit
    ? entranceLimitTime.toISOString()
    : undefined,
  time_zone: Timezones.AMERICA_SAO_PAULO,
  capacity: faker.number.int({ min: 1, max: 100000 }),
  city: faker.location.city(),
  state: faker.location.state(),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  place_name: faker.location.secondaryAddress(),
});

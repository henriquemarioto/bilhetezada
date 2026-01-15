import { Event } from '@/modules/event/entities/event.entity';
import { Order } from '@/modules/sales/entities/order.entity';
import { User } from '@/modules/user/entities/user.entity';
import { faker } from '@faker-js/faker/.';
import { randomUUID } from 'crypto';
import { Timezones } from '@/shared/enums/timezones.enum';

type EventFactoryProps = {
  user: User;
  orders?: Order[];
};

export const eventFactory = ({
  user,
  orders = [],
}: EventFactoryProps): Event => {
  const startTime = new Date();
  const endTime = new Date();
  const limitTimeForTicketPurchase = new Date();

  startTime.setDate(new Date().getDate() + 3);
  endTime.setDate(new Date().getDate() + 4);
  limitTimeForTicketPurchase.setDate(new Date().getDate() + 3);

  const event: Event = {
    id: randomUUID(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    place_name: faker.location.secondaryAddress(),
    description: faker.lorem.words(20),
    name: faker.lorem.words(5),
    slug: faker.lorem.slug(5),
    start_at: startTime.toISOString(),
    end_at: endTime.toISOString(),
    status: faker.helpers.arrayElement([
      'DRAFT',
      'PUBLISHED',
      'CANCELED',
      'FINISHED',
    ]) as Event['status'],
    time_zone: Timezones.AMERICA_SAO_PAULO,
    created_at: new Date(),
    updated_at: new Date(),
    user: user,
    organizer_user_id: user.id,
    orders: orders,
    batches: [],
    entrance_limit_at: limitTimeForTicketPurchase.toISOString(),
    capacity: faker.number.int({ min: 50, max: 1000 }),
  };

  return event;
};

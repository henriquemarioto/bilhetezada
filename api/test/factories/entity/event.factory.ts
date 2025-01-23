import { randomUUID } from 'crypto';
import { Event } from '@/entities/event.entity';
import { faker } from '@faker-js/faker/.';
import { PaymentLink } from '@/entities/payment-link.entity';
import { Customer } from '@/entities/customer.entity';
import { Order } from '@/entities/order.entity';
import { Timezones } from '@/modules/shared/enums/timezones.enum';

type EventFactoryProps = {
  customer: Customer;
  paymentLinks?: PaymentLink[];
  orders?: Order[];
};

export const eventFactory = ({
  customer,
  paymentLinks = [],
  orders = [],
}: EventFactoryProps): Event => {
  const event = {
    id: randomUUID(),
    active: true,
    address: faker.location.streetAddress(),
    description: faker.lorem.words(20),
    name: faker.lorem.words(5),
    price: 2000,
    slug: faker.lorem.slug(5),
    limit_time_for_ticket_purchase: new Date(),
    start_time: new Date(),
    end_time: new Date(),
    time_zone: Timezones.AMERICA_SAO_PAULO,
    created_at: new Date(),
    updated_at: new Date(),
    customer: customer,
    orders: orders,
    entrance_limit_time: null,
    paymentLinks: paymentLinks,
  };

  return event;
};

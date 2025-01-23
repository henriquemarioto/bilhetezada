import { faker } from '@faker-js/faker/.';
import { PaymentLink } from '@/entities/payment-link.entity';
import { PaymentLinkOwner } from '@/modules/shared/enums/payment-link-owner.enum';
import { Event } from '@/entities/event.entity';

type PaymentLinkFactoryProps = {
  event: Event;
  owner?: PaymentLinkOwner;
};

export const paymentLinkFactory = ({
  event,
  owner = PaymentLinkOwner.EVENT,
}: PaymentLinkFactoryProps): PaymentLink => ({
  id: faker.string.uuid(),
  owner: owner,
  url: faker.internet.url(),
  event: event,
  created_at: new Date(),
  updated_at: new Date(),
});

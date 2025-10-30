import { OpenPixPixWebhookBodyDto } from '@/modules/payment/dto/openpix-pix-webhook-body.dto';
import OpenPixChargeStatus from '@/modules/shared/enums/openpix-charge-status.enum';
import { faker } from '@faker-js/faker/.';

export const openPixPixWebhookBodyDtoFactory = (
  chargeStatus: OpenPixChargeStatus = OpenPixChargeStatus.COMPLETED,
): OpenPixPixWebhookBodyDto => ({
  charge: {
    brCode: faker.string.alphanumeric(30),
    correlationID: faker.string.uuid(),
    customer: null,
    status: chargeStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    transactionID: faker.string.uuid(),
  },
  pix: {
    pixQrCode: null,
    charge: {},
    customer: {},
    payer: {},
    time: new Date().toISOString(),
    value: faker.number.int({ min: 1000, max: 30000 }),
    transactionID: faker.string.uuid(),
    infoPagador: faker.person.firstName(),
    raw: {},
  },
  pixQrCode: null,
});

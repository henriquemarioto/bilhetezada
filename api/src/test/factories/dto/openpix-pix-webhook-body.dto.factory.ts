import { WooviWebhookBodyDto } from '@/modules/payment/dtos/woovi-pix-webhook-body.dto';
import WooviChargeStatus from '@/shared/enums/woovi-charge-status.enum';
import { WooviWebhookEvents } from '@/shared/enums/woovi-webhook-events.enum';
import { faker } from '@faker-js/faker/.';

export const wooviWebhookBodyDtoFactory = (
  chargeStatus: WooviChargeStatus = WooviChargeStatus.COMPLETED,
): WooviWebhookBodyDto => ({
  charge: {
    brCode: faker.string.alphanumeric(30),
    correlationID: faker.string.uuid(),
    status: chargeStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    transactionID: faker.string.uuid(),
    paidAt: new Date().toISOString(),
    customer: {
      correlationID: faker.string.uuid(),
      name: faker.person.fullName(),
      taxID: {
        taxID: faker.string.numeric(11),
        type: 'BR:CPF',
      },
    },
    value: 0,
    comment: '',
    identifier: '',
    additionalInfo: [],
    fee: 0,
    discount: 0,
    valueWithDiscount: 0,
    expiresDate: '',
    type: '',
    paymentLinkID: '',
    payer: null,
    ensureSameTaxID: false,
    expiresIn: 0,
    pixKey: '',
    paymentLinkUrl: '',
    qrCodeImage: '',
    globalID: '',
    paymentMethods: {
      pix: {
        method: '',
        txId: '',
        value: 0,
        status: WooviChargeStatus.COMPLETED,
        fee: 0,
        brCode: '',
        transactionID: '',
        identifier: '',
        qrCodeImage: '',
      },
    },
  },
  pix: {
    pixQrCode: null,
    charge: {},
    user: {},
    payer: {},
    time: new Date().toISOString(),
    value: faker.number.int({ min: 1000, max: 30000 }),
    transactionID: faker.string.uuid(),
    infoPagador: faker.person.firstName(),
    raw: {},
  },
  event: WooviWebhookEvents.CHARGE_COMPLETED,
});

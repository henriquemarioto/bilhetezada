import { WooviChargeResponseDto } from '@/modules/payment/dtos/woovi-charge-response.dto';
import { faker } from '@faker-js/faker/.';
import WooviChargeStatus from '@/shared/enums/woovi-charge-status.enum';

export const wooviChargeResponseDtoFactory = (): WooviChargeResponseDto => ({
  charge: {
    additionalInfo: [],
    brCode: faker.string.alphanumeric(30),
    correlationID: faker.string.uuid(),
    paymentLinkID: faker.string.uuid(),
    user: null,
    expiresDate: new Date().toISOString(),
    expiresIn: faker.number.int({ min: 1112000, max: 2592000 }),
    comment: '',
    status: WooviChargeStatus.COMPLETED,
    paymentLinkUrl: faker.internet.url(),
    paymentMethods: {},
    value: faker.number.int({ min: 1000, max: 40000 }),
    qrCodeImage: faker.internet.url(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
});

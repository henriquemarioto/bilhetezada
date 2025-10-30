import { OpenPixChargeResponseDto } from '@/modules/payment/dto/openpix-charge-response.dto';
import OpenPixChargeStatus from '@/modules/shared/enums/openpix-charge-status.enum';
import { faker } from '@faker-js/faker/.';

export const openPixChargeResponseDtoFactory =
  (): OpenPixChargeResponseDto => ({
    data: {
      charge: {
        additionalInfo: [],
        brCode: faker.string.alphanumeric(30),
        correlationID: faker.string.uuid(),
        paymentLinkID: faker.string.uuid(),
        customer: null,
        expiresDate: new Date().toISOString(),
        expiresIn: faker.number.int({ min: 1112000, max: 2592000 }),
        comment: '',
        status: OpenPixChargeStatus.COMPLETED,
        paymentLinkUrl: faker.internet.url(),
        paymentMethods: {},
        value: faker.number.int({ min: 1000, max: 40000 }),
        qrCodeImage: faker.internet.url(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    status: 200,
  });

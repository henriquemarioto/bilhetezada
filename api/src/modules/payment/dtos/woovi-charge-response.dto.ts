import WooviChargeStatus from '@/shared/enums/woovi-charge-status.enum';

export class WooviChargeResponseDto {
  charge: {
    status: WooviChargeStatus;
    user: unknown;
    value: number;
    comment: string;
    correlationID: string;
    paymentLinkID: string;
    paymentLinkUrl: string;
    qrCodeImage: string;
    expiresIn: number;
    expiresDate: string;
    createdAt: string;
    updatedAt: string;
    brCode: string;
    additionalInfo: unknown[];
    paymentMethods: unknown;
  };
}

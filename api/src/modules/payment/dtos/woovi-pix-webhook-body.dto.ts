import WooviChargeStatus from '@/shared/enums/woovi-charge-status.enum';
import { WooviWebhookEvents } from '@/shared/enums/woovi-webhook-events.enum';
import { Allow } from 'class-validator';

class ChargeDto {
  value: number;
  comment: string;
  identifier: string;
  transactionID: string;
  status: WooviChargeStatus;
  additionalInfo: [];
  fee: number;
  discount: number;
  valueWithDiscount: number;
  expiresDate: string;
  type: string;
  correlationID: string;
  paymentLinkID: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    taxID: {
      taxID: string;
      type: 'BR:CNPJ' | 'BR:CPF';
    };
    correlationID: string;
  };
  paidAt: string;
  payer: null;
  ensureSameTaxID: false;
  brCode: string;
  expiresIn: number;
  pixKey: string;
  paymentLinkUrl: string;
  qrCodeImage: string;
  globalID: string;
  paymentMethods: {
    pix: {
      method: string;
      txId: string;
      value: number;
      status: WooviChargeStatus;
      fee: number;
      brCode: string;
      transactionID: string;
      identifier: string;
      qrCodeImage: string;
    };
  };
}

export class WooviWebhookBodyDto {
  @Allow()
  event: WooviWebhookEvents;

  @Allow()
  charge: ChargeDto;

  @Allow()
  pix: unknown;
}

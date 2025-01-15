import OpenPixWebhookStatus from 'src/modules/shared/enums/openpix-webhook-status.enum';

export class PixWebhookBodyDto {
  charge: {
    status: OpenPixWebhookStatus;
    customer?: unknown;
    correlationID: string;
    transactionID: string;
    brCode: string;
    createdAt: Date;
    updatedAt: Date;
  };
  pix: {
    pixQrCode: null;
    charge: unknown;
    customer: unknown;
    payer: unknown;
    time: Date;
    value: number;
    transactionID: string;
    infoPagador: string;
    raw: unknown;
  };
  pixQrCode: null;
}

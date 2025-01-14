import { HttpResponse } from '../../shared/dto/http-response.dto';

export class OpenPixChargeResponseDto extends HttpResponse {
  data: {
    charge: {
      customer: null;
      value: number;
      identifier: string;
      correlationID: string;
      paymentLinkID: string;
      transactionID: string;
      status: 'ACTIVE';
      giftbackAppliedValue: number;
      discount: number;
      valueWithDiscount: number;
      expiresDate: Date;
      type: 'DYNAMIC';
      createdAt: Date;
      additionalInfo: unknown[];
      updatedAt: Date;
      expiresIn: number;
      pixKey: string;
      brCode: string;
      paymentLinkUrl: string;
      qrCodeImage: string;
      globalID: string;
    };
    correlationID: string;
    brCode: string;
  };
}

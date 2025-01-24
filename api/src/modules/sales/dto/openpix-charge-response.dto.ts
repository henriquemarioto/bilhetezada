import OpenPixChargeStatus from '@/modules/shared/enums/openpix-charge-status.enum';
import { HttpResponse } from '../../shared/dto/http-response.dto';

export class OpenPixChargeResponseDto extends HttpResponse {
  data: {
    charge: {
      status: OpenPixChargeStatus;
      customer: unknown;
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
  };
}

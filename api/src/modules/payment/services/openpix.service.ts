import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PaymentMethods } from '../../shared/enums/payment-methods.enum';
import { HttpService } from '../../shared/services/http.service';
import { OpenPixChargeResponseDto } from '../dto/openpix-charge-response.dto';
import { PaymentService } from './payment.service';

@Injectable()
export class OpenPixService implements PaymentService {
  private readonly apiBaseUrl: string;
  private readonly appId: string;
  private readonly headers: {
    Authorization: string;
    'Content-Type': string;
  };

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiBaseUrl = configService.get('openPixApiUrl') ?? '';
    this.appId = configService.get('openPixAppId') ?? '';
    this.headers = {
      Authorization: this.appId,
      'Content-Type': 'application/json',
    };
  }

  async generateCharge(
    amount: number,
    type: PaymentMethods = PaymentMethods.PIX,
    currency: string = 'BRL',
  ) {
    const url = this.apiBaseUrl + '/charge';
    const chargeResult = (await this.httpService.post(url, {
      headers: this.headers,
      body: {
        value: amount,
        correlationID: randomUUID(),
      },
    })) as OpenPixChargeResponseDto | false;

    if (chargeResult === false) {
      console.error('Error generating pix charge', {
        url: url,
        amount,
      });

      throw new InternalServerErrorException(
        'Error generating pix payment with external provider',
      );
    }

    return {
      transactionId: chargeResult.data.charge.correlationID,
      qrcodeImageUrl: chargeResult.data.charge.qrCodeImage,
      pixCopyPaste: chargeResult.data.charge.brCode,
      value: chargeResult.data.charge.value,
      expiresDate: chargeResult.data.charge.expiresDate,
    };
  }
  async getPaymentStatus(transactionId: string): Promise<string> {
    return '';
  }
}

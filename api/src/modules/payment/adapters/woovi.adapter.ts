import { HttpService } from '@/modules/shared/services/http.service';
import { WooviSplitTypes } from '@/shared/enums/woovi-split-types.enum';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { WooviChargeResponseDto } from '../dtos/woovi-charge-response.dto';
import { WooviGetSubaccountDetailsDto } from '../dtos/woovi-get-subaccount-details.dto';
import { PaymentProcessor } from '../interfaces/payment-processor.interface';

@Injectable()
export class WooviAdapter implements PaymentProcessor {
  readonly apiBaseUrl: string;
  readonly apiKey: string;
  readonly defaultChargeExpirationSeconds: number;

  private readonly headers: {
    Authorization: string;
    'Content-Type': string;
  };

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiBaseUrl = configService.get('wooviApiUrl') ?? '';
    this.apiKey = configService.get('wooviAppId') ?? '';
    this.defaultChargeExpirationSeconds = configService.get<number>(
      'defaultChargeExpirationSeconds',
    ) as number;
    this.headers = {
      Authorization: this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  calculateGatewayFee(amount: number): { feeAmount: number; feeRule: string } {
    const feeRule = '0.8% (min R$ 0.50, max R$ 5.00)';
    const feePercentage = 0.008; // 0.8%

    let feeAmount = Math.ceil(amount * feePercentage);

    if (feeAmount < 50) {
      feeAmount = 50;
    }

    if (feeAmount > 500) {
      feeAmount = 500;
    }

    return { feeAmount, feeRule };
  }

  async generateCharge(params: {
    amount: number;
    splitDetails: { pixKey: string; amount: number }[];
    description: string;
    buyerInfo?: { name: string; phone?: string; email?: string };
    additionalInfo?: { key: string; value: any }[];
    expiresInSeconds?: number;
  }) {
    const url = this.apiBaseUrl + '/charge';

    const chargeResult = await this.httpService.post<WooviChargeResponseDto>(
      url,
      {
        headers: this.headers,
        body: {
          value: params.amount,
          correlationID: randomUUID(),
          expiresIn:
            params.expiresInSeconds ?? this.defaultChargeExpirationSeconds,
          comment: params.description,
          customer: params.buyerInfo,
          additionalInfo: params.additionalInfo,
          splits: params.splitDetails.map((split) => ({
            pixKey: split.pixKey,
            value: split.amount,
            splitType: WooviSplitTypes.SPLIT_SUB_ACCOUNT,
          })),
        },
      },
    );

    if (chargeResult === false) {
      console.error('Error generating pix charge', {
        url: url,
        amount: params.amount,
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
      checkoutUrl: chargeResult.data.charge.paymentLinkUrl,
      expiresDate: chargeResult.data.charge.expiresDate,
    };
  }

  async getPaymentStatus(transactionId: string): Promise<string> {
    return '';
  }

  async getBalance(pixKey: string): Promise<number> {
    const response = await this.httpService.get<WooviGetSubaccountDetailsDto>(
      this.apiBaseUrl + `/subaccount/${pixKey}`,
      {
        headers: this.headers,
      },
    );

    if (!response) {
      throw new InternalServerErrorException(
        'Error getting balance from external provider',
      );
    }

    return response.data.SubAccount.balance;
  }

  async withdraw(pixKey: string, value: number): Promise<boolean> {
    const url = this.apiBaseUrl + ``;

    const response = await this.httpService.post(
      url + `/subaccount/${pixKey}/withdraw`,
      {
        headers: this.headers,
        body: {
          value,
        },
      },
    );

    if (!response) {
      throw new InternalServerErrorException(
        'Error making withdrawal with external provider',
      );
    }

    return true;
  }

  async registerSplit(pixKey: string, name: string): Promise<boolean> {
    const url = this.apiBaseUrl + `/subaccount`;

    const response = await this.httpService.post(url, {
      headers: this.headers,
      body: {
        pixKey,
        name,
      },
    });

    if (!response) {
      throw new InternalServerErrorException(
        'Error registering split with external provider',
      );
    }

    return true;
  }
}

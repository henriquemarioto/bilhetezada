import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '../../shared/services/http.service';
import { randomUUID } from 'crypto';
import { OpenPixChargeResponseDto } from '../dto/openpix-charge-response.dto';

@Injectable()
export class OpenPixService {
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
    this.apiBaseUrl = configService.get('openPixApiUrl');
    this.appId = configService.get('openPixAppId');
    this.headers = {
      Authorization: this.appId,
      'Content-Type': 'application/json',
    };
  }

  async generatePixCharge(
    value: number,
  ): Promise<OpenPixChargeResponseDto | false> {
    const url = this.apiBaseUrl + '/charge';
    const chargeResult = (await this.httpService.post(url, {
      headers: this.headers,
      body: {
        value: value,
        correlationID: randomUUID(),
      },
    })) as OpenPixChargeResponseDto | false;

    if (chargeResult === false) {
      console.error('Error generating pix charge', {
        url: url,
        value,
      });
    }

    return chargeResult;
  }
}

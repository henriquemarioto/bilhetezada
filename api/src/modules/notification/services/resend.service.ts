import { ConfigService } from '@nestjs/config';
import { HttpService } from '@/modules/shared/services/http.service';
import { NotificationService } from './notification.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResendService implements NotificationService {
  private readonly resendApiKey: string;

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.resendApiKey = configService.get('resendApiKey') ?? '';
  }

  async send(to: string, message: string, subject: string): Promise<void> {
    await this.httpService.post('https://api.resend.com/emails', {
      headers: {
        Authorization: `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        to,
        subject,
        message,
      },
    });
  }
}

import { HttpService } from '@/modules/shared/services/http.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationProviderInterface } from '../interfaces/notification-provider.interface';
import { SendNotificationDto } from '../dtos/send-notificaiton.dto';
import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { isEmailData } from '../utils/isEmailData';

@Injectable()
export class ResendProvider implements NotificationProviderInterface {
  private readonly apiBaseUrl: string;
  private readonly resendApiKey: string;

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiBaseUrl = configService.get('resendApiBaseUrl') ?? '';
    this.resendApiKey = configService.get('resendApiKey') ?? '';
  }

  async send(data: SendNotificationDto): Promise<void> {
    if (data.channel !== NotificationChannel.EMAIL) {
      console.warn(
        `ResendEmailProvider cannot send notification for channel: ${data.channel}`,
        data,
      );
      return;
    }

    if (!isEmailData(data.data)) {
      console.error(
        'ResendEmailProvider requires subject and content for email notifications',
        data,
      );
      return;
    }

    await this.sendEmail(data.to, data.data.subject, data.data.content);
  }

  private async sendEmail(
    to: string,
    subject: string,
    message: string,
  ): Promise<void> {
    await this.httpService.post(this.apiBaseUrl + '/emails', {
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

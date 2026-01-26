import { HttpService } from '@/modules/shared/services/http.service';
import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendNotificationDto } from '../dtos/send-notificaiton.dto';
import { NotificationProviderInterface } from '../interfaces/notification-provider.interface';
import { getFromEmail } from '../utils/email-config.utils';
import { isEmailData } from '../utils/isEmailData';

@Injectable()
export class ResendProvider implements NotificationProviderInterface {
  private readonly apiBaseUrl: string;
  private readonly resendApiKey: string;
  private readonly fromEmail: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiBaseUrl = this.configService.get('resendApiBaseUrl') ?? '';
    this.resendApiKey = this.configService.get('resendApiKey') ?? '';
    this.fromEmail = getFromEmail(this.configService);
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
    const response = await this.httpService.post(this.apiBaseUrl + '/emails', {
      headers: {
        Authorization: `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        from: `Bilhetezada <${this.fromEmail}>`,
        to: [to],
        subject,
        html: message,
      },
    });

    if (response === false) {
      console.error('Resend email API call failed', {
        to,
        subject,
        message: JSON.stringify(message),
      });
      throw new Error('Failed to send email via Resend');
    }

    console.log('Email sent via Resend to:', to);
  }
}

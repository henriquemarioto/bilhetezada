import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationProviderInterface } from '../interfaces/notification-provider.interface';
import {
  SendNotificationDto,
  WhatsappData,
} from '../dtos/send-notificaiton.dto';
import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { HttpService } from '@/modules/shared/services/http.service';
import { isWhatsappData } from '../utils/isWhatsappData';
import { Logger } from '@/core/logger/logger.interface';
import { In } from 'typeorm';
import { LOGGER } from '@/core/logger/logger.tokens';

enum WhatsAppMessageTypes {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  TEMPLATE = 'template',
  AUDIO = 'audio',
  VIDEO = 'video',
  INTERACTIVE = 'interactive',
}

@Injectable()
export class WhatsAppProvider implements NotificationProviderInterface {
  private readonly logger: Logger;
  private readonly apiBaseUrl: string;
  private readonly apiAccessToken: string;
  private readonly header: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(LOGGER)
    baseLogger: Logger,
  ) {
    this.logger = baseLogger.withContext(WhatsAppProvider.name);
    this.apiBaseUrl = `https://graph.facebook.com/${
      configService.get('whatsappCloudApiVersion') || ''
    }/${configService.get('whatsappCloudApiPhoneNumberId') || ''}/messages`;
    this.apiAccessToken =
      configService.get('whatsappCloudApiAccessToken') ?? '';
    this.header['Authorization'] = `Bearer ${this.apiAccessToken}`;
  }

  async send(data: SendNotificationDto): Promise<void> {
    if (data.channel !== NotificationChannel.WHATSAPP) {
      this.logger.warn(
        `WhatsAppProvider cannot send notification for channel: ${data.channel}`,
        data,
      );
      return;
    }

    if (!isWhatsappData(data.data)) {
      this.logger.error('Data not provided for WhatsApp notifications', data);
      throw new Error('Data not provided for WhatsApp notifications');
    }

    await this.sendWhatsAppMessage(data.to, data.data);
  }

  async sendWhatsAppMessage(
    to: string,
    whatsappData: WhatsappData,
  ): Promise<void> {
    const response = await this.httpService.post<unknown>(this.apiBaseUrl, {
      body: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: WhatsAppMessageTypes.INTERACTIVE,
        interactive: {
          type: 'cta_url',
          body: {
            text: whatsappData?.bodyText || '',
          },
          action: {
            name: 'cta_url',
            parameters: {
              display_text: whatsappData?.buttonLabel || '',
              url: whatsappData?.buttonUrl || '',
            },
          },
          footer: {
            text: whatsappData?.footerText || '',
          },
        },
      },
      headers: this.header,
    });

    if (!response) {
      this.logger.error('Failed to send WhatsApp message to', { to });
      throw new Error('Failed to send WhatsApp message');
    }

    this.logger.info(`Message sent via WhatsApp. Status: ${response.status}`, );
  }
}

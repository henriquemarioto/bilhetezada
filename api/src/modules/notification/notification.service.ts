import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { SendNotificationDto } from './dtos/send-notificaiton.dto';
import { NotificationProviderInterface } from './interfaces/notification-provider.interface';
import { getFromEmail } from './utils/email-config.utils';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_PROVIDER_MAP')
    private readonly providers: Partial<
      Record<NotificationChannel, NotificationProviderInterface>
    >,
    private readonly configService: ConfigService,
  ) {}

  async send(dto: SendNotificationDto) {
    const provider = this.providers[dto.channel];

    if (!provider) {
      throw new Error(
        `Channel ${dto.channel} not configured for notifications`,
      );
    }

    await provider.send(dto);
  }

  getFromEmail(): string {
    return getFromEmail(this.configService);
  }

  renderEmailTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): string {
    const templatePath = path.resolve(
      __dirname,
      'templates',
      'email',
      `${templateName}.html`,
    );

    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    let renderedTemplate = templateContent;
    for (const key in variables) {
      const placeholder = `{{${key}}}`;
      renderedTemplate = renderedTemplate.replace(
        new RegExp(placeholder, 'g'),
        variables[key],
      );
    }

    return renderedTemplate;
  }
}

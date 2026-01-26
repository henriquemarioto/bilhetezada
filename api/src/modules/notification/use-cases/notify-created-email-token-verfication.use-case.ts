import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { EmailVerificationTokenCreatedEvent } from '@/modules/auth/domain-events/email-verification-token-created.event';
import { ConfigService } from '@nestjs/config';
import { Environments } from '@/shared/enums/environments.enum';

@Injectable()
export class NotifyCreatedEmailTokenVerificationUseCase {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  async execute(data: EmailVerificationTokenCreatedEvent): Promise<void> {
    const emailContent = this.notificationService.renderEmailTemplate(
      'verify-email',
      {
        EMAIL_TOKEN: data.token,
        APPLICATION_BASE_URL:
          this.configService.get('nodeEnv') === Environments.DEVELOPMENT
            ? 'http://localhost:3132'
            : 'no_url_provided',
      },
    );

    await this.notificationService.send({
      channel: NotificationChannel.EMAIL,
      to: data.email,
      data: {
        subject: 'Verificação de email',
        content: emailContent,
      },
    });
  }
}

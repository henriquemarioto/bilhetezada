import { Inject, Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dtos/send-notificaiton.dto';
import { NotificationProviderInterface } from './interfaces/notification-provider.interface';
import { NotificationChannel } from '@/shared/enums/notification-channel.enum';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_PROVIDER_MAP')
    private readonly providers: Partial<
      Record<NotificationChannel, NotificationProviderInterface>
    >,
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
}

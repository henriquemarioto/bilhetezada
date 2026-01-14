import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import SharedModule from '../shared/shared.module';
import { NotificationProviderInterface } from './interfaces/notification-provider.interface';
import { NotificationService } from './notification.service';
import { ResendProvider } from './providers/resend.provider';
import { OnTicketsCreatedListener } from './listeners/on-tickets-created.listener';
import { WhatsAppProvider } from './providers/whatsapp.provider';
import { NotifyCreatedTicketsUseCase } from './use-cases/notify-created-tickets.use-case';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [ConfigModule, SharedModule, SalesModule],
  controllers: [],
  providers: [
    NotificationService,
    ResendProvider,
    WhatsAppProvider,
    NotifyCreatedTicketsUseCase,
    OnTicketsCreatedListener,
    {
      provide: 'NOTIFICATION_PROVIDER_MAP',
      useFactory: (
        resend: ResendProvider,
        whatsapp: WhatsAppProvider,
      ): Partial<
        Record<NotificationChannel, NotificationProviderInterface>
      > => ({
        [NotificationChannel.EMAIL]: resend,
        [NotificationChannel.WHATSAPP]: whatsapp,
      }),
      inject: [ResendProvider, WhatsAppProvider],
    },
  ],
  exports: [],
})
export class NotificationModule {}

import { EventFailureModule } from '@/infrastructure/observability/event-failure/event-failure.module';
import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import SharedModule from '../shared/shared.module';
import { NotificationProviderInterface } from './interfaces/notification-provider.interface';
import { OnEmailVerificationTokenCreatedListener } from './listeners/on-email-verification-token-created.listener';
import { OnTicketsCreatedListener } from './listeners/on-tickets-created.listener';
import { NotificationService } from './notification.service';
import { ResendProvider } from './providers/resend.provider';
import { WhatsAppProvider } from './providers/whatsapp.provider';
import { NotifyCreatedEmailTokenVerificationUseCase } from './use-cases/notify-created-email-token-verfication.use-case';
import { NotifyCreatedTicketsUseCase } from './use-cases/notify-created-tickets.use-case';

@Module({
  imports: [ConfigModule, SharedModule, EventFailureModule],
  controllers: [],
  providers: [
    NotificationService,
    ResendProvider,
    WhatsAppProvider,
    NotifyCreatedTicketsUseCase,
    NotifyCreatedEmailTokenVerificationUseCase,
    OnTicketsCreatedListener,
    OnEmailVerificationTokenCreatedListener,
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

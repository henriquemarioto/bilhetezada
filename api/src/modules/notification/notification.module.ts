import { Module } from '@nestjs/common';
import SharedModule from '../shared/shared.module';
import { ResendService } from './services/resend.service';
import { NotificationDispatcher } from './notification.dispatcher';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, SharedModule],
  controllers: [],
  providers: [
    ResendService,
    { provide: 'EmailService', useClass: ResendService },
    NotificationDispatcher,
  ],
  exports: [NotificationDispatcher],
})
export class NotificationModule {}

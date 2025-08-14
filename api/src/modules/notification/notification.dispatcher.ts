import { Inject } from '@nestjs/common';
import { NotificationService } from './services/notification.service';

export class NotificationDispatcher {
  constructor(
    @Inject('EmailService') private readonly emailService: NotificationService,
  ) {}

  async notify(
    channel: 'email' | 'sms',
    to: string,
    message: string,
    options?: Record<string, any>,
  ) {
    if (channel === 'email') {
      return this.emailService.send(to, message, options?.subject);
    }
  }
}

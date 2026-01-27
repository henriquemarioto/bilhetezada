import { FailedEventService } from '@/infrastructure/observability/event-failure/services/failed-event.service';
import { EmailVerificationTokenCreatedEvent } from '@/modules/auth/domain-events/email-verification-token-created.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotifyCreatedEmailTokenVerificationUseCase } from '../use-cases/notify-created-email-token-verfication.use-case';

@Injectable()
export class OnEmailVerificationTokenCreatedListener {
  constructor(
    private readonly notifyCreatedEmailTokenVerificationUseCase: NotifyCreatedEmailTokenVerificationUseCase,
    private readonly failedEventService: FailedEventService,
  ) {}

  @OnEvent('email-verification-token.created')
  async handle(domainEvent: EmailVerificationTokenCreatedEvent) {
    try {
      await this.notifyCreatedEmailTokenVerificationUseCase.execute(domainEvent);
    } catch (error) {
      await this.failedEventService.registerFailure(
        'email-verification-token.created',
        'OnEmailVerificationTokenCreatedListener',
        { userId: domainEvent.userId, email: domainEvent.email },
        error,
      );
    }
  }
}

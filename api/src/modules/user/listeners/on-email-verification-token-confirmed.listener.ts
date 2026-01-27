import { FailedEventService } from '@/infrastructure/observability/event-failure/services/failed-event.service';
import { EmailVerificationTokenConfirmedEvent } from '@/modules/auth/domain-events/email-verification-token-confirmed.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VerifyUserEmailUseCase } from '../use-cases/verify-user-email.use-case';

@Injectable()
export class OnEmailVerificationTokenConfirmedListener {
  constructor(
    private readonly verifyUserEmailUseCase: VerifyUserEmailUseCase,
    private readonly failedEventService: FailedEventService,
  ) {}

  @OnEvent('email-verification-token.confirmed')
  async handle(domainEvent: EmailVerificationTokenConfirmedEvent) {
    try {
      await this.verifyUserEmailUseCase.execute(domainEvent.userId);
    } catch (error) {
      await this.failedEventService.registerFailure(
        'email-verification-token.confirmed',
        'OnEmailVerificationTokenConfirmedListener',
        { userId: domainEvent.userId },
        error,
      );
    }
  }
}

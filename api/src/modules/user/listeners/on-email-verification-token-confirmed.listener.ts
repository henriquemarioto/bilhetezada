import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailVerificationTokenConfirmedEvent } from '@/modules/auth/domain-events/email-verification-token-confirmed.event';
import { VerifyUserEmailUseCase } from '../use-cases/verify-user-email.use-case';

@Injectable()
export class OnEmailVerificationTokenConfirmedListener {
  constructor(
    private readonly verifyUserEmailUseCase: VerifyUserEmailUseCase,
  ) {}

  @OnEvent('email-verification-token.confirmed')
  handle(domainEvent: EmailVerificationTokenConfirmedEvent) {
    console.log(
      `Handling EmailVerificationTokenConfirmedEvent for user ID: ${domainEvent.userId}`,
    );
    this.verifyUserEmailUseCase.execute(domainEvent.userId);
  }
}

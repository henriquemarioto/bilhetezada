import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailVerificationTokenCreatedEvent } from '@/modules/auth/domain-events/email-verification-token-created.event';
import { NotifyCreatedEmailTokenVerificationUseCase } from '../use-cases/notify-created-email-token-verfication.use-case';

@Injectable()
export class OnEmailVerificationTokenCreatedListener {
  constructor(
    private readonly notifyCreatedEmailTokenVerificationUseCase: NotifyCreatedEmailTokenVerificationUseCase,
  ) {}

  @OnEvent('email-verification-token.created')
  handle(domainEvent: EmailVerificationTokenCreatedEvent) {
    console.log('OnEmailVerificationTokenCreatedListener triggered');
    this.notifyCreatedEmailTokenVerificationUseCase.execute(domainEvent);
  }
}

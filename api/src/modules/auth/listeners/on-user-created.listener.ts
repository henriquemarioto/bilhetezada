import { FailedEventService } from '@/infrastructure/observability/event-failure/services/failed-event.service';
import { UserCreatedEvent } from '@/modules/user/domain-events/user-created.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateEmailVerificationTokenUseCase } from '../use-cases/create-email-verification-token.use-case';

@Injectable()
export class OnUserCreatedListener {
  constructor(
    private readonly createEmailVerificationTokenUseCase: CreateEmailVerificationTokenUseCase,
    private readonly failedEventService: FailedEventService,
  ) { }

  @OnEvent('user.created')
  async handle(domainEvent: UserCreatedEvent) {
    try {
      await this.createEmailVerificationTokenUseCase.execute(
        domainEvent.userId,
        domainEvent.email,
      );
    } catch (error) {
      await this.failedEventService.registerFailure(
        'user.created',
        'OnUserCreatedListener',
        { userId: domainEvent.userId, email: domainEvent.email },
        error,
      );
    }
  }
}

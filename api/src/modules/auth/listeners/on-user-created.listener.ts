import { UserCreatedEvent } from '@/modules/user/domain-events/user-created.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateEmailVerificationTokenUseCase } from '../use-cases/create-email-verification-token.use-case';

@Injectable()
export class OnUserCreatedListener {
  constructor(
    private readonly createEmailVerificationTokenUseCase: CreateEmailVerificationTokenUseCase,
  ) { }

  @OnEvent('user.created')
  handle(domainEvent: UserCreatedEvent) {
    console.log(
      `Evento de usuário criado recebido no listener de criação de token de verificação de email, para o usuário ID: ${domainEvent.userId}, email: ${domainEvent.email}`,
    );
    this.createEmailVerificationTokenUseCase.execute(
      domainEvent.userId,
      domainEvent.email,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { EmailVerificationTokenRepository } from '../repositories/email-verification-token.repository';
import CryptoService from '@/modules/shared/services/crypto.service';
import { EmailVerificationTokenCreatedEvent } from '../domain-events/email-verification-token-created.event';
import { EventEmitterService } from '@/modules/shared/services/event-emitter.service';

@Injectable()
export class CreateEmailVerificationTokenUseCase {
  constructor(
    private emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly cryptoService: CryptoService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async execute(userId: string, email: string): Promise<void> {
    const token = this.cryptoService.randomBytes(32, 'base64url');

    await this.emailVerificationTokenRepository.createEmailVerificationToken(
      userId,
      token,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );

    console.log('Token de verificação de email criado:', token);

    this.eventEmitterService.emitAsync(
      'email-verification-token.created',
      new EmailVerificationTokenCreatedEvent(userId, email, token),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { EmailVerificationTokenRepository } from '../repositories/email-verification-token.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEmitterService } from '@/modules/shared/services/event-emitter.service';
import { EmailVerificationTokenConfirmedEvent } from '../domain-events/email-verification-token-confirmed.event';

@Injectable()
export class ConfirmEmailVerificationTokenUseCase {
  constructor(
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async execute(token: string): Promise<void> {
    const record =
      await this.emailVerificationTokenRepository.findByToken(token);

    if (!record) {
      throw new Error('Invalid or expired token');
    }

    const now = new Date();

    const expiresAt = record.expires_at;

    if (now > expiresAt) {
      throw new Error('Token has expired');
    }

    await this.emailVerificationTokenRepository.markAsUsed(
      record.user_id,
    );

    this.eventEmitterService.emitAsync(
      'email-verification-token.confirmed',
      new EmailVerificationTokenConfirmedEvent(record.user_id),
    );
  }
}

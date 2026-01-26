import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';

@Injectable()
export class EmailVerificationTokenRepository extends TypeOrmBaseRepository<EmailVerificationToken> {
  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
  ) {
    super(emailVerificationTokenRepository);
  }

  async createEmailVerificationToken(userId: string, token: string, expiresAt: Date): Promise<EmailVerificationToken> {
    return this.createImplementation({ user_id: userId, token, expires_at: expiresAt });
  }

  async findByToken(token: string): Promise<EmailVerificationToken | null> {
    return this.findOne({
      where: {
        token: token,
      },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.updateImplementation(id, { used_at: new Date() });
  }
}

import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.respository';

@Injectable()
export class VerifyUserEmailUseCase {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new ConflictException('User not found');
    }

    if (user.email_verified) {
      return true;
    }

    await this.userRepository.verifyUserEmail(userId);

    return true;
  }
}

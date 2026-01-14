import { Injectable } from '@nestjs/common';
import { PixKeyDto } from '../dtos/pix-key.dto';
import { UserRepository } from '../repositories/user.respository';

@Injectable()
export class RegisterUserPixKeyUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, pixKeyDto: PixKeyDto): Promise<void> {
    await this.userRepository.updatePixKey(userId, pixKeyDto.pixKey);
  }
}

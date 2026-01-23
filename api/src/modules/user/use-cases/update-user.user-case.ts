import CryptoService from '@/modules/shared/services/crypto.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserRepository } from '../repositories/user.respository';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private cryptoService: CryptoService,
  ) { }

  async execute(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    if (updateUserDto.password)
      updateUserDto.password = this.cryptoService.hashSalt(
        updateUserDto.password,
      );

    await this.userRepository.update(userId, updateUserDto);

    return true;
  }
}

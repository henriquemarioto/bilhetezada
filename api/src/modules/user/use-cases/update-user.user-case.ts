import CryptoService from '@/modules/shared/services/crypto.service';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.respository';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    if (updateUserDto.password)
      updateUserDto.password = this.cryptoService.encryptSalt(
        updateUserDto.password,
      );

    if (updateUserDto.email)
      updateUserDto.email = this.cryptoService.encrypt(updateUserDto.email);

    if (updateUserDto.document)
      updateUserDto.document = this.cryptoService.encrypt(
        updateUserDto.document,
      );

    await this.userRepository.update(userId, updateUserDto);

    return true;
  }
}

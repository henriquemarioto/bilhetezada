import CryptoService from '@/modules/shared/services/crypto.service';
import { SlugService } from '@/modules/shared/services/slug.service';
import AuthProviders from '@/shared/enums/auth-providers.enum';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.respository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute(
    provider: AuthProviders,
    createUserDto: CreateUserDto,
  ): Promise<boolean> {
    const userDtoToProcess = { ...createUserDto };

    const userFound = await this.userRepository.findByEmailOrDocument(
      userDtoToProcess.email,
    );

    if (userFound) {
      throw new ConflictException(`Document or email already in use`);
    }

    if (userDtoToProcess.password)
      userDtoToProcess.password = this.cryptoService.hashSalt(
        userDtoToProcess.password,
      );

    await this.userRepository.createUser(provider, userDtoToProcess);

    return true;
  }
}

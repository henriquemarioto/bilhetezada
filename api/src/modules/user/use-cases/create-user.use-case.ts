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
    private slugService: SlugService,
    private cryptoService: CryptoService,
  ) {}

  async execute(
    provider: AuthProviders,
    createUserDto: CreateUserDto,
  ): Promise<boolean> {
    const userDtoToProcess = { ...createUserDto };

    userDtoToProcess.email = this.cryptoService.encrypt(userDtoToProcess.email);

    if (!userDtoToProcess.document && provider === AuthProviders.LOCAL) {
      throw new BadRequestException('Document needed for local users');
    }

    if (userDtoToProcess.document)
      userDtoToProcess.document = this.cryptoService.encrypt(
        userDtoToProcess.document,
      );

    const userFound = await this.userRepository.findByEmailOrDocument(
      userDtoToProcess.email,
      userDtoToProcess.document,
    );

    if (userFound) {
      throw new ConflictException(`Document or email already in use`);
    }

    if (userDtoToProcess.password)
      userDtoToProcess.password = this.cryptoService.encryptSalt(
        userDtoToProcess.password,
      );

    await this.userRepository.createUser(provider, userDtoToProcess);

    return true;
  }
}

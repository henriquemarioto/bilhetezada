import CryptoService from '@/modules/shared/services/crypto.service';
import AuthProviders from '@/shared/enums/auth-providers.enum';
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.respository';
import { UserCreatedEvent } from '../domain-events/user-created.event';
import { EventEmitterService } from '@/modules/shared/services/event-emitter.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private cryptoService: CryptoService,
    private eventEmitterService: EventEmitterService,
  ) {}

  async execute(
    provider: AuthProviders,
    createUserDto: CreateUserDto,
  ): Promise<boolean> {
    const userDtoToProcess = { ...createUserDto };

    const emailAlreadyExists = await this.userRepository.emailExists(
      userDtoToProcess.email,
    );

    if (emailAlreadyExists) {
      throw new ConflictException(`Email already in use`);
    }

    if (userDtoToProcess.password)
      userDtoToProcess.password = this.cryptoService.hashSalt(
        userDtoToProcess.password,
      );

    const user = await this.userRepository.createUser(provider, userDtoToProcess);

    console.log("Usuário criado com sucesso", user.id);

    this.eventEmitterService.emitAsync('user.created', new UserCreatedEvent(user.id, userDtoToProcess.email));

    return true;
  }
}

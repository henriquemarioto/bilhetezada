import CryptoService from '@/modules/shared/services/crypto.service';
import AuthProviders from '@/shared/enums/auth-providers.enum';
import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.respository';
import { UserCreatedEvent } from '../domain-events/user-created.event';
import { EventEmitterService } from '@/modules/shared/services/event-emitter.service';
import { Logger } from '@/core/logger/logger.interface';
import { LOGGER } from '@/core/logger/logger.tokens';

@Injectable()
export class CreateUserUseCase {
  private readonly logger: Logger;

  constructor(
    private readonly userRepository: UserRepository,
    private cryptoService: CryptoService,
    private eventEmitterService: EventEmitterService,
    @Inject(LOGGER)
    baseLogger: Logger,
  ) {
    this.logger = baseLogger.withContext(CreateUserUseCase.name);
  }

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

    this.logger.info("Usuário criado com sucesso", { userId: user.id });

    this.eventEmitterService.emitAsync('user.created', new UserCreatedEvent(user.id, userDtoToProcess.email));

    return true;
  }
}

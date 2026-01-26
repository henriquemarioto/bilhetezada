import { User } from '@/modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedModule from '../shared/shared.module';
import { UserRepository } from './repositories/user.respository';
import { UserService } from './services/user.service';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.user-case';
import { UserController } from './user.controller';
import { RegisterUserPixKeyUseCase } from './use-cases/register-use-pix-key.use-case';
import { OnEmailVerificationTokenConfirmedListener } from './listeners/on-email-verification-token-confirmed.listener';
import { VerifyUserEmailUseCase } from './use-cases/verify-user-email.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserUseCase,
    UpdateUserUseCase,
    UserRepository,
    RegisterUserPixKeyUseCase,
    OnEmailVerificationTokenConfirmedListener,
    VerifyUserEmailUseCase,
  ],
  exports: [UserService, CreateUserUseCase],
})
export class UserModule {}

import { EventFailureModule } from '@/infrastructure/observability/event-failure/event-failure.module';
import { Logout } from '@/modules/auth/entities/logout.entity';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedModule from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { OnUserCreatedListener } from './listeners/on-user-created.listener';
import { EmailVerificationTokenRepository } from './repositories/email-verification-token.repository';
import { AuthService } from './services/auth.service';
import { ConfirmEmailVerificationTokenUseCase } from './use-cases/confirm-email-verification-token.use-case';
import { CreateEmailVerificationTokenUseCase } from './use-cases/create-email-verification-token.use-case';
import { JwtAuthGuard } from './utils/guards/jwt.guard';
import { SessionSerializer } from './utils/serializer';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { LocalStrategy } from './utils/strategies/local.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '40m' },
      }),
    }),
    TypeOrmModule.forFeature([Logout, EmailVerificationToken]),
    forwardRef(() => UserModule),
    SharedModule,
    EventFailureModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
    SessionSerializer,
    JwtAuthGuard,
    OnUserCreatedListener,
    EmailVerificationTokenRepository,
    CreateEmailVerificationTokenUseCase,
    ConfirmEmailVerificationTokenUseCase,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}

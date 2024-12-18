import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Logout } from '../../database/typeorm/entities/logout.entity';
import SharedModule from '../shared/shared.module';
import { CustomerModule } from '../customer/customer.module';
import { AuthService } from './auth.service';
import { LoginGoogleCallbackController } from './controllers/login-google-callback.controller';
import { LoginGoogleController } from './controllers/login-google.controller';
import { LoginController } from './controllers/login.controller';
import { LogoutController } from './controllers/logout.controller';
import { CreateAccountController } from './controllers/sign-up.controller';
import { JwtAuthGuard } from './utils/guards/jwt.guard';
import { SessionSerializer } from './utils/serializer';
import { GoogleStrategy } from './utils/strategies/google.strategy';
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
        signOptions: { expiresIn: '20m' },
      }),
    }),
    TypeOrmModule.forFeature([Logout]),
    forwardRef(() => CustomerModule),
    SharedModule,
  ],
  controllers: [
    CreateAccountController,
    LoginController,
    LoginGoogleCallbackController,
    LoginGoogleController,
    LogoutController,
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
    SessionSerializer,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}

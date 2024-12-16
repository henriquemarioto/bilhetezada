import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CustomerModule } from '../customer/customer.module';
import { AuthService } from './auth.service';
import { CreateAccountController } from './controllers/sign-up.controller';
import { LoginGoogleCallbackController } from './controllers/login-google-callback.controller';
import { LoginGoogleController } from './controllers/login-google.controller';
import { LoginController } from './controllers/login.controller';
import { LogoutController } from './controllers/logout.controller';
import { SessionSerializer } from './utils/serializer';
import { GoogleStrategy } from './utils/strategies/google.strategy';
import SharedModule from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { LocalStrategy } from './utils/strategies/local.strategy';
import { Logout } from 'src/database/typeorm/entities/logout.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './utils/guards/jwt.guard';

@Module({
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
  imports: [
    forwardRef(() => CustomerModule),
    PassportModule.register({ session: true }),
    ConfigModule,
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '10m' },
      }),
    }),
    TypeOrmModule.forFeature([Logout]),
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CustomerModule } from 'src/customer/customer.module';
import { AuthService } from './auth.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { LoginGoogleCallbackController } from './controllers/login-google-callback.controller';
import { LoginGoogleController } from './controllers/login-google.controller';
import { LoginController } from './controllers/login.controller';
import { LogoutController } from './controllers/logout.controller';
import { SessionSerializer } from './utils/serializer';
import { GoogleStrategy } from './utils/strategies/google.strategy';
import { LocalStrategy } from './utils/strategies/local.strategy';

@Module({
  controllers: [
    CreateAccountController,
    LoginController,
    LoginGoogleCallbackController,
    LoginGoogleController,
    LogoutController,
  ],
  providers: [AuthService, GoogleStrategy, LocalStrategy, SessionSerializer],
  imports: [
    CustomerModule,
    PassportModule.register({ session: true }),
    ConfigModule,
  ],
})
export class AuthModule {}

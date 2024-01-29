import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/google.strategy';
import { CustomerModule } from 'src/customer/customer.module';
import { SessionSerializer } from './utils/serializer';
import { LocalStrategy } from './utils/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, LocalStrategy, SessionSerializer],
  imports: [CustomerModule, PassportModule.register({ session: true })],
})
export class AuthModule {}

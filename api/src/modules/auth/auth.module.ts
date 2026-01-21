import { Logout } from '@/modules/auth/entities/logout.entity';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedModule from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
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
        signOptions: { expiresIn: '40m' },
      }),
    }),
    TypeOrmModule.forFeature([Logout]),
    forwardRef(() => UserModule),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
    SessionSerializer,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}

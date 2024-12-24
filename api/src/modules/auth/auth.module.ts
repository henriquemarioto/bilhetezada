import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logout } from '../../database/typeorm/entities/logout.entity';
import SharedModule from '../shared/shared.module';
import { CustomerModule } from '../customer/customer.module';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './utils/guards/jwt.guard';
import { SessionSerializer } from './utils/serializer';
import { GoogleStrategy } from './utils/strategies/google.strategy';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { LocalStrategy } from './utils/strategies/local.strategy';
import { AuthController } from './auth.controller';

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
  controllers: [AuthController],
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

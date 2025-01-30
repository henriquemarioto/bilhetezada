import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from 'nestjs-pino';
import typeormConfig from './database/typeorm/typeorm.config';
import { LoggerService } from './logger';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { EventModule } from './modules/event/event.module';
import { SalesModule } from './modules/sales/sales.module';
import configuration from './modules/shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get('typeorm');
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 86400,
    }),
    PassportModule.register({ session: true }),
    LoggerModule.forRoot(),
    AuthModule,
    CustomerModule,
    EventModule,
    SalesModule,
  ],
  controllers: [],
  providers: [LoggerService],
})
export class AppModule {}

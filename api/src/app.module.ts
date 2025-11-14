import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import configuration from './config/env.config';
import typeormConfig from './infrastructure/database/typeorm/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { EventModule } from './modules/event/event.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SalesModule } from './modules/sales/sales.module';

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
        const typeOrmConfig = configService.get('typeorm');
        if (!typeOrmConfig) {
          throw new Error('TypeORM configuration is not defined');
        }
        return typeOrmConfig;
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 86400,
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    CustomerModule,
    EventModule,
    SalesModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

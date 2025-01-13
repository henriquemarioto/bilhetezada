import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import typeormConfig from './database/typeorm/typeorm.config';
import typeormTestConfig from './database/typeorm/typeorm-test.config';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { EventModule } from './modules/event/event.module';
import configuration from './modules/shared/config/configuration';
import { SalesModule } from './modules/sales/sales.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, typeormConfig, typeormTestConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (process.env.NODE_ENV === 'test') {
          return configService.get('typeorm-test');
        }
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
    AuthModule,
    CustomerModule,
    EventModule,
    SalesModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

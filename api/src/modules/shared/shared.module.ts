import { forwardRef, Module } from '@nestjs/common';
import { SlugService } from './services/slug.service';
import { ConfigModule } from '@nestjs/config';
import CryptoService from './services/crypto.service';
import { Timezone } from 'src/database/typeorm/entities/timezone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import TimezoneService from './services/timezone.service';
import CacheService from './services/cache.service';
import { GetTimezonesController } from './controller/get-timezones.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CustomerModule } from 'src/modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Timezone]),
    forwardRef(() => AuthModule),
    forwardRef(() => CustomerModule),
  ],
  providers: [SlugService, CryptoService, CacheService, TimezoneService],
  controllers: [GetTimezonesController],
  exports: [SlugService, CryptoService, CacheService, TimezoneService],
})
export default class SharedModule {}

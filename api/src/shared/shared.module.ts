import { Module } from '@nestjs/common';
import { SlugService } from './services/slug.service';
import { ConfigModule } from '@nestjs/config';
import CryptoService from './services/crypto.service';
import { Timezone } from 'src/database/typeorm/entities/timezone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import TimezoneService from './services/timezone.service';
import CacheService from './services/cache.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Timezone])],
  providers: [SlugService, CryptoService, CacheService, TimezoneService],
  exports: [SlugService, CryptoService, TimezoneService],
})
export default class SharedModule {}

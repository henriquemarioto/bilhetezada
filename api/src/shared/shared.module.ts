import { Module } from '@nestjs/common';
import { SlugService } from './services/slug.service';
import { ConfigModule } from '@nestjs/config';
import CryptoService from './services/crypto.service';

@Module({
  imports: [ConfigModule],
  providers: [SlugService, CryptoService],
  exports: [SlugService, CryptoService],
})
export default class SharedModule {}

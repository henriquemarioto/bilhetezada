import { ConfigModule } from '@nestjs/config';
import CacheService from './services/cache.service';
import CryptoService from './services/crypto.service';
import { SlugService } from './services/slug.service';
import { QRCodeService } from './services/qrcode.service';
import { Module } from '@nestjs/common';
import TimezoneService from './services/timezone.service';

@Module({
  imports: [ConfigModule],
  providers: [
    SlugService,
    CryptoService,
    CacheService,
    QRCodeService,
    TimezoneService,
  ],
  exports: [
    SlugService,
    CryptoService,
    CacheService,
    QRCodeService,
    TimezoneService,
  ],
})
export default class SharedModule {}

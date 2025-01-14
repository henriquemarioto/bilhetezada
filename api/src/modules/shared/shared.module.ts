import { ConfigModule } from '@nestjs/config';
import CacheService from './services/cache.service';
import CryptoService from './services/crypto.service';
import { SlugService } from './services/slug.service';
import { QRCodeService } from './services/qrcode.service';
import { Module } from '@nestjs/common';
import TimezoneService from './services/timezone.service';
import { HttpService } from './services/http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  providers: [
    SlugService,
    CryptoService,
    CacheService,
    QRCodeService,
    TimezoneService,
    HttpService,
  ],
  exports: [
    SlugService,
    CryptoService,
    CacheService,
    QRCodeService,
    TimezoneService,
    HttpService,
  ],
})
export default class SharedModule {}

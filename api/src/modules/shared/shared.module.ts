import { ConfigModule } from '@nestjs/config';
import CacheService from './services/cache.service';
import CryptoService from './services/crypto.service';
import { SlugService } from './services/slug.service';
import { QRCodeService } from './services/qrcode.service';
import { Module } from '@nestjs/common';
import TimezoneService from './services/timezone.service';
import { HttpService } from './services/http.service';
import { HttpModule } from '@nestjs/axios';
import { OpenPixService } from './services/openpix.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { Ticket } from '@/entities/ticket.entity';
import { Payment } from '@/entities/payment.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 10000,
    }),
    TypeOrmModule.forFeature([Order, Ticket, Payment]),
  ],
  providers: [
    SlugService,
    CryptoService,
    CacheService,
    QRCodeService,
    TimezoneService,
    HttpService,
    OpenPixService,
  ],
  exports: [
    SlugService,
    CryptoService,
    CacheService,
    QRCodeService,
    TimezoneService,
    HttpService,
    OpenPixService,
  ],
})
export default class SharedModule {}

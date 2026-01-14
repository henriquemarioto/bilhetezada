import { Payment } from '@/modules/payment/entities/payment.entity';
import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import { Order } from '@/modules/sales/entities/order.entity';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import CacheService from './services/cache.service';
import CryptoService from './services/crypto.service';
import { HttpService } from './services/http.service';
import { QRCodeService } from './services/qrcode.service';
import { SlugService } from './services/slug.service';
import TimezoneService from './services/timezone.service';

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

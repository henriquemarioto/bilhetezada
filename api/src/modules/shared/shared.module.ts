import { Order } from '@/entities/order.entity';
import { Payment } from '@/entities/payment.entity';
import { Ticket } from '@/entities/ticket.entity';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import CacheService from './services/cache.service';
import CryptoService from './services/crypto.service';
import { HttpService } from './services/http.service';
import { MessagingService } from './services/messaging.service';
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
    MessagingService,
  ],
  exports: [
    SlugService,
    CryptoService,
    CacheService,
    QRCodeService,
    TimezoneService,
    HttpService,
    MessagingService,
  ],
})
export default class SharedModule {}

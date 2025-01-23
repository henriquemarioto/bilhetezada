import { Event } from '@/entities/event.entity';
import { PaymentLink } from '@/entities/payment-link.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import SharedModule from '../shared/shared.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, PaymentLink]),
    SharedModule,
    CustomerModule,
    AuthModule,
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}

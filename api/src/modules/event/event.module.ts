import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedModule from '../shared/shared.module';
import { Event } from '../../database/typeorm/entities/event.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PaymentLink } from '../../database/typeorm/entities/payment-link.entity';

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

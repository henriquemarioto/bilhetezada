import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedModule from '../shared/shared.module';
import { Event } from '../../database/typeorm/entities/event.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import { CreateEventController } from './controllers/create-event.controller';
import { DeleteEventController } from './controllers/delete-event.controller';
import { GetEventController } from './controllers/get-event.controller';
import { UpdateEventController } from './controllers/update-event.controller';
import { EventService } from './event.service';
import { GetCustomerEventsController } from './controllers/get-customer-events.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    SharedModule,
    CustomerModule,
    AuthModule,
  ],
  providers: [EventService],
  controllers: [
    CreateEventController,
    GetEventController,
    UpdateEventController,
    DeleteEventController,
    GetCustomerEventsController,
  ],
  exports: [EventService],
})
export class EventModule {}

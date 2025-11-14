import { Event } from './entities/event.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import SharedModule from '../shared/shared.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { EventRepository } from './repositories/event.respository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    SharedModule,
    CustomerModule,
    AuthModule,
  ],
  providers: [EventService, CreateEventUseCase, EventRepository],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../../database/typeorm/entities/event.entity';
import { CreateEventController } from './controllers/create-event.controller';
import { DeleteEventController } from './controllers/delete-event.controller';
import { GetEventController } from './controllers/get-event.controller';
import { UpdateEventController } from './controllers/update-event.controller';
import { EventService } from './event.service';
import SharedModule from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), SharedModule],
  providers: [EventService],
  controllers: [
    CreateEventController,
    GetEventController,
    UpdateEventController,
    DeleteEventController,
  ],
})
export class EventModule {}

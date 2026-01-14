import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import SharedModule from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { EventController } from './controllers/event.controller';
import { Batch } from './entities/batch.entity';
import { Event } from './entities/event.entity';
import { BatchRepository } from './repositories/batch.respository';
import { EventRepository } from './repositories/event.respository';
import { BatchService } from './services/batch.service';
import { EventService } from './services/event.service';
import { CreateBatchUseCase } from './use-cases/create-batch.use-case';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { BatchController } from './controllers/batch.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Batch]),
    SharedModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    EventService,
    BatchService,
    CreateEventUseCase,
    CreateBatchUseCase,
    EventRepository,
    BatchRepository,
  ],
  controllers: [EventController, BatchController],
  exports: [EventService, BatchService],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FailedEvent } from './entities/failed-event.entity';
import { FailedEventRepository } from './repositories/failed-event.repository';
import { FailedEventService } from './services/failed-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([FailedEvent])],
  providers: [FailedEventService, FailedEventRepository],
  exports: [FailedEventService],
})
export class EventFailureModule {}

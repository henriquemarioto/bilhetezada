import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import SharedModule from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { EventController } from './controllers/event.controller';
import { Event } from './entities/event.entity';
import { EventRepository } from './repositories/event.respository';
import { EventService } from './services/event.service';
import { CreateEventUseCase } from './use-cases/create-event.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    SharedModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    EventService,
    CreateEventUseCase,
    EventRepository,
  ],
  controllers: [EventController],
  exports: [EventService, EventRepository],
})
export class EventModule {}

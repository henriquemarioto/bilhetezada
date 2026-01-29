import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from '../event/event.module';
import { UserModule } from '../user/user.module';
import { BatchController } from './controllers/batch.controller';
import { TicketTypeController } from './controllers/ticket-type.controller';
import { Batch } from './entities/batch.entity';
import { TicketType } from './entities/ticket-type.entity';
import { Ticket } from './entities/ticket.entity';
import { BatchRepository } from './repositories/batch.respository';
import { TicketTypeRepository } from './repositories/ticket-type.respository';
import { TicketRepository } from './repositories/ticket.repository';
import { BatchService } from './services/batch.service';
import { TicketTypeService } from './services/ticket-type.service';
import { TicketService } from './ticket.service';
import { CreateBatchUseCase } from './use-cases/create-batch.use-case';
import { CreateTicketTypeUseCase } from './use-cases/create-ticket-type.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Batch, TicketType]),
    EventModule,
    UserModule,
  ],
  controllers: [BatchController, TicketTypeController],
  providers: [
    TicketService,
    BatchService,
    TicketTypeService,
    TicketRepository,
    BatchRepository,
    TicketTypeRepository,
    CreateBatchUseCase,
    CreateTicketTypeUseCase,
  ],
  exports: [TicketService, TicketTypeService, TicketRepository, BatchService],
})
export class TicketModule {}

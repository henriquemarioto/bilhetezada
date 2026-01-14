import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from '../event/event.module';
import { TicketBatchController } from './controllers/ticket-batch.controller';
import { TicketBatch } from './entities/ticket-batch.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketBatchRepository } from './repositories/ticket-batch.respository';
import { TicketRepository } from './repositories/ticket.repository';
import { TicketBatchService } from './services/ticket-batch.service';
import { TicketService } from './ticket.service';
import { CreateTicketBatchUseCase } from './use-cases/create-ticket-batch.use-case';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketBatch]),
    EventModule,
    UserModule,
  ],
  controllers: [TicketBatchController],
  providers: [
    TicketService,
    TicketBatchService,
    TicketRepository,
    TicketBatchRepository,
    CreateTicketBatchUseCase,
  ],
  exports: [TicketService, TicketRepository, TicketBatchService],
})
export class TicketModule {}

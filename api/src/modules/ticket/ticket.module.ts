import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketRepository } from './repositories/ticket.repository';
import { TicketService } from './ticket.service';
import { EventModule } from '../event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), EventModule],
  providers: [TicketService, TicketRepository],
  exports: [TicketService, TicketRepository ],
})
export class TicketModule {}

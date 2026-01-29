import { Injectable } from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import {
  CreateTicketData,
  TicketRepository,
} from './repositories/ticket.repository';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async createTicket(orderItemId: string, batchId: string, ticketTypeId: string, sequence: number = 1): Promise<Ticket> {
    return this.ticketRepository.createTicket({ orderItemId, batchId, ticketTypeId, sequence });
  }

  async createManyTickets(
    orderItemId: string,
    batchId: string,
    quantity: number,
    ticketTypeId: string
  ): Promise<Ticket[]> {
    const data: CreateTicketData[] = [];

    for (let i = 0; i < quantity; i++) {
      data.push({ orderItemId, batchId, ticketTypeId, sequence: i + 1 });
    }

    return this.ticketRepository.createManyTickets(data);
  }
}

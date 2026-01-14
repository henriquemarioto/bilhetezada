import { Injectable } from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import {
  CreateTicketData,
  TicketRepository,
} from './repositories/ticket.repository';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async createTicket(orderItemId: string, ticketBatchId: string): Promise<Ticket> {
    return this.ticketRepository.createTicket({ orderItemId, ticketBatchId });
  }

  async createManyTickets(
    orderItemId: string,
    ticketBatchId: string,
    quantity: number,
  ): Promise<Ticket[]> {
    const data: CreateTicketData[] = [];

    for (let i = 0; i < quantity; i++) {
      data.push({ orderItemId, ticketBatchId });
    }

    return this.ticketRepository.createManyTickets(data);
  }
}

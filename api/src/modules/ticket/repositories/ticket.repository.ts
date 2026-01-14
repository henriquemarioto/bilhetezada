import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Ticket } from '../entities/ticket.entity';

export type CreateTicketData = {
  orderItemId: string;
  ticketBatchId: string;
};

@Injectable()
export class TicketRepository extends TypeOrmBaseRepository<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {
    super(ticketRepository);
  }

  async createTicket(createTicketData: CreateTicketData): Promise<Ticket> {
    return this.createImplementation({
      order_item_id: createTicketData.orderItemId,
      ticket_batch_id: createTicketData.ticketBatchId,
    });
  }

  async createManyTickets(
    createTicketsData: CreateTicketData[],
  ): Promise<Ticket[]> {
    return this.createManyImplementation(
      createTicketsData.map((data) => ({
        order_item_id: data.orderItemId,
        ticket_batch_id: data.ticketBatchId,
      })),
    );
  }

  async findByOrderItemIds(orderItemsIds: string[]): Promise<Ticket[]> {
    if (!orderItemsIds.length) {
      return [];
    }

    return this.findAllImplementation({
      where: { order_item_id: { $in: orderItemsIds } },
    });
  }

  async findTicketsByTicketBatchIds(ticketBatchIds: string[]): Promise<Ticket[]> {
    if (!ticketBatchIds.length) {
      return [];
    }

    return this.findAllImplementation({
      where: { ticket_batch_id: { $in: ticketBatchIds } },
    });
  }
}

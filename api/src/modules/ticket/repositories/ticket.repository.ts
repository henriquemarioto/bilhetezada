import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';

export type CreateTicketData = {
  orderItemId: string;
  batchId: string;
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
      batch_id: createTicketData.batchId,
    });
  }

  async createManyTickets(
    createTicketsData: CreateTicketData[],
  ): Promise<Ticket[]> {
    return this.createManyImplementation(
      createTicketsData.map((data) => ({
        order_item_id: data.orderItemId,
        batch_id: data.batchId,
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

  async findTicketsByBatchIds(batchIds: string[]): Promise<Ticket[]> {
    if (!batchIds.length) {
      return [];
    }

    return this.findAllImplementation({
      where: { batch_id: { $in: batchIds } },
    });
  }
}

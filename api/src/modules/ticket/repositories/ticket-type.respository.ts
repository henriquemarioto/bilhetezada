import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketType } from '../entities/ticket-type.entity';
import { CreateTicketTypeDto } from '../dtos/create-ticket-type.dto';

@Injectable()
export class TicketTypeRepository extends TypeOrmBaseRepository<TicketType> {
  constructor(
    @InjectRepository(TicketType)
    private readonly ticketTypeRepository: Repository<TicketType>,
  ) {
    super(ticketTypeRepository);
  }

  async findOneById(id: string): Promise<TicketType | null> {
    return this.findOneImplementation({
      where: { id },
    });
  }

  async findOneByNameAndEventId(eventId: string, name: string): Promise<TicketType | null> {
    return this.findOneImplementation({
      where: { eventId, name },
    });
  }

  async createTicketType(eventId: string, data: CreateTicketTypeDto): Promise<TicketType> {
    return this.createImplementation({
      eventId,
      ...data,
    });
  }
}

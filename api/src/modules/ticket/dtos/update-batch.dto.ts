import { PartialType } from '@nestjs/swagger';
import { CreateTicketBatchDto } from './create-ticket-batch.dto';

export class UpdateTicketBatchDto extends PartialType(CreateTicketBatchDto) {}

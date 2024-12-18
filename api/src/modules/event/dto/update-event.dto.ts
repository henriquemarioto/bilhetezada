import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { Exclude } from 'class-transformer';

export class UpdateEventDTO extends PartialType(CreateEventDto) {
  @Exclude()
  active: boolean;
}

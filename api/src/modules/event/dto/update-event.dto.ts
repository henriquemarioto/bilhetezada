import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { Exclude } from 'class-transformer';

export class UpdateEventDTO extends PartialType(CreateEventDto) {
  @Exclude()
  active: boolean;
}

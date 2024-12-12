import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEventDTO extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsBoolean()
  active: boolean;
}

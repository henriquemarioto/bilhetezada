import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEventDTO extends PartialType(CreateEventDto) {
  @Exclude()
  active?: boolean;

  @IsString()
  @IsOptional()
  url?: string;
}

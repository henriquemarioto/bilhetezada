import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTicketTypeRequestBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;
}

export class CreateTicketTypeDto {
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { CreateBuyerDto } from './create-buyer.dto';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateBuyerDto)
  buyer: CreateBuyerDto;
}

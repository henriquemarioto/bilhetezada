import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreateBuyerDto } from './create-buyer.dto';

export class CreateTicketOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  batchId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  ticketQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateBuyerDto)
  buyer: CreateBuyerDto;
}

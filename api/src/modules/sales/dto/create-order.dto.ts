import { ApiProperty } from '@nestjs/swagger';
import { CreateBuyerDto } from './create-buyer.dto';
import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  eventId: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateBuyerDto)
  buyer: CreateBuyerDto;
}

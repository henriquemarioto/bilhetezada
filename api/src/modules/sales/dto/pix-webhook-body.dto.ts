import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PixWebhookBody {
  @ApiProperty()
  @IsString()
  transaction_id: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsString()
  status: string;
}

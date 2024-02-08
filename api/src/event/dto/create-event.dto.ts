import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  customerId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  start_time: string;

  @IsDate()
  end_time: boolean;

  @IsDate()
  entrance_limit_time: string;

  @IsNumber()
  price: string;
}

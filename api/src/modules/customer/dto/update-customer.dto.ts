import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { Exclude } from 'class-transformer';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @Exclude()
  active: boolean;

  @Exclude()
  password?: string;
}

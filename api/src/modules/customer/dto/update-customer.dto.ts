import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { Exclude } from 'class-transformer';

export class UpdateCustomerDTO extends PartialType(CreateCustomerDto) {
  @Exclude()
  active: boolean;

  @Exclude()
  password?: string;
}

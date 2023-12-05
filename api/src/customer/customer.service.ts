import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customerInstance = new this.customerModel(createCustomerDto);
    const createdCustomer = await customerInstance.save();

    if (createdCustomer) return true;
    return false;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const updated = await this.customerModel.findByIdAndUpdate(
      id,
      updateCustomerDto,
      {
        new: true,
      },
    );

    if (updated) return true;
    return false;
  }

  async disable(id: string) {
    const disbled = await this.customerModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );

    if (disbled) true;
    return false;
  }
}

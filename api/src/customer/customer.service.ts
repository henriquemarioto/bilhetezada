import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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
    const customersFound = await Promise.all([
      this.customerModel.findOne({ email: createCustomerDto.email }),
      this.customerModel.findOne({ document: createCustomerDto.document }),
    ]);

    if (
      customersFound.some((item) => {
        if (item) return true;
      })
    ) {
      throw new ConflictException(`Document or email already in use`);
    }

    const customerInstance = new this.customerModel(createCustomerDto);
    try {
      return customerInstance.save();
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while creating customer`,
      );
    }
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      return this.customerModel.findByIdAndUpdate(id, updateCustomerDto, {
        new: true,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while updating customer`,
      );
    }
  }

  disable(id: string) {
    try {
      return this.customerModel.findByIdAndUpdate(
        id,
        { active: false },
        { new: true },
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while updating customer`,
      );
    }
  }
}

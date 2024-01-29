import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customerInstance = new this.customerModel(createCustomerDto);
    try {
      const customer = await customerInstance.save();
      const { password, ...data } = customer;
      return data;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while creating customer`,
      );
    }
  }

  async findByEmailOrDocument(email: string = null, doc: string = null) {
    const [customerByEmail, customerByDocument] = await Promise.all([
      this.customerModel.findOne({ email: email }),
      this.customerModel.findOne({ document: doc }),
    ]);
    if (customerByEmail || customerByDocument)
      return customerByEmail || customerByDocument;
  }

  async findById(id: string) {
    return await this.customerModel.findById(id);
  }

  async findAll() {
    return await this.customerModel.find();
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

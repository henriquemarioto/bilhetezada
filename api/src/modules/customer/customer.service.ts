import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCustomerDto,
  CreateCustomerPartialDTO,
} from './dto/create-customer.dto';
import { Customer } from 'src/database/typeorm/entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto | CreateCustomerPartialDTO,
  ) {
    try {
      const customer = await this.customersRepository.save(createCustomerDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...data } = customer;
      return data;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while creating customer`,
      );
    }
  }

  async findByEmailOrDocument(
    email: string | null = null,
    doc: string | null = null,
  ) {
    const [customerByEmail, customerByDocument] = await Promise.all([
      this.customersRepository.findOne({
        where: {
          email: email,
        },
      }),
      this.customersRepository.findOne({ where: { document: doc } }),
    ]);
    if (customerByEmail || customerByDocument)
      return customerByEmail || customerByDocument;
  }

  async findById(id: string) {
    return await this.customersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findAll() {
    return await this.customersRepository.find();
  }

  async update(id: string, updateCustomerDto: CreateCustomerPartialDTO) {
    try {
      await this.customersRepository.update(id, updateCustomerDto);
      return this.findById(id);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while updating customer`,
      );
    }
  }

  async disable(id: string) {
    try {
      await this.customersRepository.update(id, { active: false });
      return true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while deleting customer`,
      );
    }
  }
}

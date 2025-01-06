import { SlugService } from './../shared/services/slug.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../../database/typeorm/entities/customer.entity';
import AuthProviders from '../shared/enums/auth-providers.enum';
import { Repository } from 'typeorm';
import {
  CreateCustomerDto,
  CreateCustomerPartialDTO,
} from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import CryptoService from '../shared/services/crypto.service';

export interface CustomerWithoutPassword extends Omit<Customer, 'password'> {}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private cryptoService: CryptoService,
    private slugService: SlugService,
  ) {}

  async create(
    provider: AuthProviders,
    createCustomerDto: CreateCustomerDto | CreateCustomerPartialDTO,
  ): Promise<CustomerWithoutPassword> {
    try {
      createCustomerDto.email = this.cryptoService.encrypt(
        createCustomerDto.email,
      );
      if (createCustomerDto.document)
        createCustomerDto.document = this.cryptoService.encrypt(
          createCustomerDto.document,
        );
      const customerFound = await this.findByEmailOrDocument(
        createCustomerDto.email,
        createCustomerDto.document,
      );
      if (customerFound) {
        throw new ConflictException(
          `Document or email already in use for this.`,
        );
      }
      if (createCustomerDto.password)
        createCustomerDto.password = this.cryptoService.encryptSalt(
          createCustomerDto.password,
        );
      if (!createCustomerDto.picture_url)
        createCustomerDto.picture_url = `https://api.dicebear.com/9.x/identicon/svg?seed=${this.slugService.slug(
          createCustomerDto.name,
        )}`;
      const customer = await this.customersRepository.save({
        ...createCustomerDto,
        auth_provider: provider,
      });
      const { password, ...data } = customer;
      return data;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `An error occurred while creating customer`,
      );
    }
  }

  async findByEmailOrDocument(email: string = '', doc: string = '') {
    const [customerByEmail, customerByDocument] = await Promise.all([
      this.customersRepository.findOne({
        where: {
          email: email,
        },
      }),
      this.customersRepository.findOne({
        where: { document: doc },
      }),
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

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      if (updateCustomerDto.password)
        updateCustomerDto.password = this.cryptoService.encryptSalt(
          updateCustomerDto.password,
        );
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

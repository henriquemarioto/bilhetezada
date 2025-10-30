import { SlugService } from './../shared/services/slug.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@/entities/customer.entity';
import AuthProviders from '../shared/enums/auth-providers.enum';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
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
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerWithoutPassword> {
    const customerDtoToProcess = { ...createCustomerDto };

    customerDtoToProcess.email = this.cryptoService.encrypt(
      customerDtoToProcess.email,
    );
    if (!customerDtoToProcess.document && provider === AuthProviders.LOCAL) {
      throw new BadRequestException('Document needed for local customers');
    }
    if (customerDtoToProcess.document)
      customerDtoToProcess.document = this.cryptoService.encrypt(
        customerDtoToProcess.document,
      );
    const customerFound = await this.findByEmailOrDocument(
      customerDtoToProcess.email,
      customerDtoToProcess.document,
    );
    if (customerFound) {
      throw new ConflictException(`Document or email already in use`);
    }
    if (customerDtoToProcess.password)
      customerDtoToProcess.password = this.cryptoService.encryptSalt(
        customerDtoToProcess.password,
      );
    if (!customerDtoToProcess.picture_url)
      customerDtoToProcess.picture_url = `https://api.dicebear.com/9.x/identicon/svg?seed=${this.slugService.slug(
        customerDtoToProcess.name,
      )}`;
    const customer = await this.customersRepository.save({
      ...customerDtoToProcess,
      auth_provider: provider,
    });
    const { password, ...data } = customer;
    return data;
  }

  async findByEmailOrDocument(
    email: string = '',
    doc: string = '',
  ): Promise<Customer | null> {
    const [customerByEmail, customerByDocument] = await Promise.all([
      email
        ? this.customersRepository.findOne({
            where: {
              email: email,
            },
          })
        : null,
      doc
        ? this.customersRepository.findOne({
            where: { document: doc },
          })
        : null,
    ]);
    return customerByEmail || customerByDocument;
  }

  async findById(id: string) {
    return await this.customersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.customersRepository.find();
    if (!customers.length) throw new NotFoundException('Customers not found');
    return customers;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<boolean> {
    try {
      if (updateCustomerDto.password)
        updateCustomerDto.password = this.cryptoService.encryptSalt(
          updateCustomerDto.password,
        );
      if (updateCustomerDto.email)
        updateCustomerDto.email = this.cryptoService.encrypt(
          updateCustomerDto.email,
        );
      if (updateCustomerDto.document)
        updateCustomerDto.document = this.cryptoService.encrypt(
          updateCustomerDto.document,
        );
      await this.customersRepository.update(id, updateCustomerDto);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating customer',
      );
    }
  }

  async disable(id: string): Promise<boolean> {
    try {
      await this.customersRepository.update(id, { active: false });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting customer',
      );
    }
  }
}

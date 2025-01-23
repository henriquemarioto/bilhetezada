import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Repository } from 'typeorm';
import { Customer } from '@/entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import CryptoService from '../shared/services/crypto.service';
import { SlugService } from '../shared/services/slug.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import AuthProviders from '../shared/enums/auth-providers.enum';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createCustomerDtoFactory } from '@/test/factories/dto/create-customer-dto.factory';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CustomerService', () => {
  let customerService: CustomerService;
  let cryptoService: jest.Mocked<CryptoService>;
  let slugService: jest.Mocked<SlugService>;
  let repository: MockRepository<Customer>;
  let findByEmailOrDocumentSpy: jest.SpyInstance<Promise<Customer>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CryptoService,
          useValue: {
            encrypt: jest.fn(),
            encryptSalt: jest.fn(),
          },
        },
        {
          provide: SlugService,
          useValue: {
            slug: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    cryptoService = module.get<jest.Mocked<CryptoService>>(CryptoService);
    slugService = module.get<jest.Mocked<SlugService>>(SlugService);
    repository = module.get<MockRepository<Customer>>(
      getRepositoryToken(Customer),
    );

    cryptoService.encrypt
      .mockReturnValueOnce('encryptedEmail')
      .mockReturnValueOnce('encryptedDocument');

    findByEmailOrDocumentSpy = jest.spyOn(
      customerService,
      'findByEmailOrDocument',
    );

    cryptoService.encryptSalt.mockReturnValue('encryptedPassword');

    slugService.slug.mockReturnValue('pictureUrlWithCustomerNameSlug');
  });

  it('must be defined', () => {
    expect(customerService).toBeDefined();
    expect(cryptoService).toBeDefined();
    expect(slugService).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    const createCustomerDto: CreateCustomerDto = createCustomerDtoFactory();

    it('should create and return customer data without password', async () => {
      const repositorySaveResult = {
        id: 'UUID',
        name: createCustomerDto.name,
        email: 'encryptedEmail',
        password: 'encryptedPassword',
        document: 'encryptedDocument',
        picture_url: 'pictureUrlWithCustomerNameSlug',
        auth_provider: AuthProviders.LOCAL,
      };

      findByEmailOrDocumentSpy.mockResolvedValue(null);

      repository.save.mockResolvedValue(repositorySaveResult);

      const { password, ...expectedResult } = repositorySaveResult;

      const result = await customerService.create(
        AuthProviders.LOCAL,
        createCustomerDto,
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual(expectedResult);
      expect(cryptoService.encrypt).toHaveBeenNthCalledWith(
        1,
        createCustomerDto.email,
      );
      expect(cryptoService.encrypt).toHaveBeenNthCalledWith(
        2,
        createCustomerDto.document,
      );
      expect(cryptoService.encryptSalt).toHaveBeenCalledWith(
        createCustomerDto.password,
      );
      expect(findByEmailOrDocumentSpy).toHaveBeenCalledWith(
        'encryptedEmail',
        'encryptedDocument',
      );
      expect(slugService.slug).toHaveBeenCalledWith(createCustomerDto.name);
      expect(repository.save).toHaveBeenCalledWith({
        ...createCustomerDto,
        email: 'encryptedEmail',
        document: 'encryptedDocument',
        password: 'encryptedPassword',
        picture_url: `https://api.dicebear.com/9.x/identicon/svg?seed=pictureUrlWithCustomerNameSlug`,
        auth_provider: AuthProviders.LOCAL,
      });

      findByEmailOrDocumentSpy.mockRestore();
    });

    it('should create a customer without some informations with Google login', async () => {
      const {
        password: _password,
        document: _document,
        birth_date: _birth_date,
        ...googleCustomerDto
      } = createCustomerDto;

      googleCustomerDto.picture_url = 'googlePictureUrl';

      const repositorySaveResult = {
        id: 'UUID',
        name: googleCustomerDto.name,
        email: 'encryptedEmail',
        password: null,
        document: null,
        picture_url: googleCustomerDto.picture_url,
        auth_provider: AuthProviders.GOOGLE,
      };

      findByEmailOrDocumentSpy.mockResolvedValue(null);

      repository.save.mockResolvedValue(repositorySaveResult);

      const { password: _resultPassword, ...expectedResult } =
        repositorySaveResult;

      const result = await customerService.create(
        AuthProviders.GOOGLE,
        googleCustomerDto,
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual(expectedResult);
      expect(cryptoService.encrypt).toHaveBeenNthCalledWith(
        1,
        createCustomerDto.email,
      );
      expect(cryptoService.encrypt).not.toHaveBeenNthCalledWith(2);
      expect(findByEmailOrDocumentSpy).toHaveBeenCalledWith(
        'encryptedEmail',
        undefined,
      );
      expect(cryptoService.encryptSalt).not.toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith({
        ...googleCustomerDto,
        email: 'encryptedEmail',
        auth_provider: AuthProviders.GOOGLE,
      });

      findByEmailOrDocumentSpy.mockRestore();
    });

    it('should not create a LOCAL customer without document', async () => {
      try {
        const { document, ...customerDtoWithoutDocument } = createCustomerDto;
        await customerService.create(
          AuthProviders.LOCAL,
          customerDtoWithoutDocument,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Document needed for local customers');
      }
    });

    it('should throw an ConflictException when email or document is already in use', async () => {
      try {
        findByEmailOrDocumentSpy.mockResolvedValue({} as Customer);

        await customerService.create(AuthProviders.LOCAL, createCustomerDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Document or email already in use');
      }
    });
  });

  describe('findByEmailOrDocument', () => {
    it('sholud return the customer if found with the document', async () => {
      repository.findOne.mockReturnValue({
        name: 'name',
        document: 'document',
      });

      const result = await customerService.findByEmailOrDocument(
        undefined,
        'document',
      );

      expect(result).toBeDefined();
      expect(result.name).toBe('name');
      expect(result.document).toBe('document');
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('sholud return the customer if found with the email', async () => {
      repository.findOne.mockReturnValue({
        name: 'name',
        email: 'email',
      });

      const result = await customerService.findByEmailOrDocument(
        'email',
        undefined,
      );

      expect(result).toBeDefined();
      expect(result.name).toBe('name');
      expect(result.email).toBe('email');
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null if not found', async () => {
      repository.findOne.mockReturnValueOnce(null).mockReturnValueOnce(null);

      const result = await customerService.findByEmailOrDocument(
        'email',
        'document',
      );

      expect(result).toBe(null);
      expect(repository.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('findById', () => {
    it('should be return customer if exists', async () => {
      repository.findOne.mockReturnValue({
        name: 'name',
        document: 'document',
        email: 'email',
      });

      const result = await customerService.findById('id');

      expect(result).toBeDefined();
      expect(result).toEqual({
        name: 'name',
        document: 'document',
        email: 'email',
      });
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should be return null if customer not exists', async () => {
      repository.findOne.mockReturnValue(null);

      const result = await customerService.findById('id');

      expect(result).toBe(null);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of customer', async () => {
      repository.find.mockReturnValue([{ name: 'name1' }, { name: 'name2' }]);

      const result = await customerService.findAll();

      expect(result).toBeDefined();
      expect(result).toStrictEqual([{ name: 'name1' }, { name: 'name2' }]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return NotFoundException if no exists any customer', async () => {
      try {
        repository.find.mockReturnValue([]);
        await customerService.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Customers not found');
      }
    });
  });

  describe('update', () => {
    it('should return true if customer is uptdated successfuly', async () => {
      repository.update.mockReturnValue({ name: 'updated name' });

      const result = await customerService.update('id', {
        name: 'updated name',
      });

      expect(result).toBe(true);
      expect(repository.update).toHaveBeenCalled();
    });

    it('should encrypt sensitive data before update', async () => {
      repository.update.mockReturnValue({
        name: 'updated name',
        password: 'encryptedPassword',
        email: 'encryptedEmail',
        document: 'encryptedDocument',
      });

      const result = await customerService.update('id', {
        name: 'updated name',
        password: 'password',
        email: 'email',
        document: 'document',
      });

      expect(result).toBe(true);
      expect(repository.update).toHaveBeenCalledWith('id', {
        name: 'updated name',
        password: 'encryptedPassword',
        email: 'encryptedEmail',
        document: 'encryptedDocument',
      });
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      try {
        repository.update.mockImplementation(() => {
          throw new Error();
        });

        await customerService.update('id', {
          name: 'updated name',
          password: 'password',
          email: 'email',
          document: 'document',
        });
      } catch (error) {
        expect(repository.update).toHaveBeenCalledWith('id', {
          name: 'updated name',
          password: 'encryptedPassword',
          email: 'encryptedEmail',
          document: 'encryptedDocument',
        });
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('An error occurred while updating customer');
      }
    });
  });

  describe('disable', () => {
    it('should disable a customer', async () => {
      repository.update.mockResolvedValue(true);

      const result = await customerService.disable('id');

      expect(result).toBe(true);
      expect(repository.update).toHaveBeenCalledWith('id', { active: false });
    });

    it('should throw InternalServerErrorException if delete fails', async () => {
      try {
        repository.update.mockImplementation(() => {
          throw new Error();
        });

        await customerService.disable('id');
      } catch (error) {
        expect(repository.update).toHaveBeenCalledWith('id', { active: false });
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('An error occurred while deleting customer');
      }
    });
  });
});

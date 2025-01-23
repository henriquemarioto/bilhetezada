import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomerService } from '../customer/customer.service';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import { faker } from '@faker-js/faker';
import AuthProviders from '../shared/enums/auth-providers.enum';
import { Customer } from '@/entities/customer.entity';
import { randomUUID } from 'crypto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const createCustomerDto: CreateCustomerDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  document: String(faker.number.int({ min: 11111111111, max: 99999999999 })),
  birth_date: faker.date.birthdate(),
};

const customerDto: Customer = {
  ...createCustomerDto,
  id: randomUUID(),
  active: true,
  auth_provider: AuthProviders.LOCAL,
  picture_url: faker.internet.url(),
  events: [],
  created_at: new Date(),
  updated_at: new Date(),
};

const mockedCustomer = {
  id: 'id',
  name: 'name',
  email: 'encryptedEmail',
  active: true,
};

describe('AuthController', () => {
  let authController: AuthController;
  let mockedAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue(mockedCustomer),
            login: jest.fn().mockResolvedValue({
              access_token: 'token',
            }),
            logout: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: CustomerService,
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    mockedAuthService = module.get<jest.Mocked<AuthService>>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(mockedAuthService).toBeDefined();
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with correct parameters', async () => {
      await authController.signUp(createCustomerDto);

      expect(mockedAuthService.signUp).toHaveBeenCalledWith(
        AuthProviders.LOCAL,
        createCustomerDto,
      );
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      await authController.login(customerDto);

      expect(mockedAuthService.login).toHaveBeenCalledWith(customerDto);
    });

    it('should return access token', async () => {
      const result = await authController.login(customerDto);

      expect(result).toStrictEqual({
        access_token: 'token',
      });
    });
  });

  describe('loginGoogle', () => {
    it('should do nothing', () => {
      expect(true).toBe(true);
    });
  });

  describe('loginGoogleCallback', () => {
    it('should call AuthService.login with correct parameters', async () => {
      await authController.loginGoogleCallback(customerDto);

      expect(mockedAuthService.login).toHaveBeenCalledWith(customerDto);
    });

    it('should return access token', async () => {
      const result = await authController.loginGoogleCallback(customerDto);

      expect(result).toStrictEqual({
        access_token: 'token',
      });
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout with correct parameters and return his value', async () => {
      const result = await authController.logout({
        headers: {
          authorization: 'Bearer token',
        },
      });

      expect(result).toBe(true);
      expect(mockedAuthService.logout).toHaveBeenCalledWith('token');
    });

    it('should throw NotFoundException if token not found', async () => {
      mockedAuthService.logout.mockResolvedValue(false);

      await expect(
        authController.logout({
          headers: {
            authorization: 'Bearer token',
          },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if authorization is not given', async () => {
      await expect(
        authController.logout({
          headers: {},
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { RequestUser } from '../shared/dto/request-user.dto';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: jest.Mocked<CustomerService>;
  const requestUser: RequestUser = { userId: 'id', userName: 'name' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            update: jest.fn().mockResolvedValue(true),
            disable: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<jest.Mocked<CustomerService>>(CustomerService);
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
    expect(customerService).toBeDefined();
  });

  describe('update', () => {
    it('should have JwtAuthGuard applied', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        customerController.update,
      );
      expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard]));
    });

    it('should call CustomerService.update with correct parameters', async () => {
      await customerController.update(requestUser, {
        name: 'updated name',
      });

      expect(customerService.update).toHaveBeenCalledWith(requestUser.userId, {
        name: 'updated name',
      });
    });

    it('should not have returned value', async () => {
      const result = await customerController.update(requestUser, {
        name: 'updated name',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should have JwtAuthGuard applied', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        customerController.delete,
      );
      expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard]));
    });

    it('should call CustomerService.disable with correct parameters', async () => {
      await customerController.delete(requestUser);

      expect(customerService.disable).toHaveBeenCalledWith(requestUser.userId);
    });

    it('should not have returned value', async () => {
      const result = await customerController.update(requestUser, {
        name: 'updated name',
      });

      expect(result).toBeUndefined();
    });
  });
});

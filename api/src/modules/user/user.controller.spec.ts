import { Test, TestingModule } from '@nestjs/testing';
import { RequestUser } from '../../shared/dtos/request-user.dto';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;
  const requestUser: RequestUser = { userId: 'id', userName: 'name' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            update: jest.fn().mockResolvedValue(true),
            disable: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<jest.Mocked<UserService>>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('update', () => {
    it('should have JwtAuthGuard applied', async () => {
      const guards = Reflect.getMetadata('__guards__', userController.update);
      expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard]));
    });

    it('should call UserService.update with correct parameters', async () => {
      await userController.update(requestUser, {
        name: 'updated name',
      });

      expect(userService.update).toHaveBeenCalledWith(requestUser.userId, {
        name: 'updated name',
      });
    });

    it('should not have returned value', async () => {
      const result = await userController.update(requestUser, {
        name: 'updated name',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should have JwtAuthGuard applied', async () => {
      const guards = Reflect.getMetadata('__guards__', userController.delete);
      expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard]));
    });

    it('should call UserService.disable with correct parameters', async () => {
      await userController.delete(requestUser);

      expect(userService.disable).toHaveBeenCalledWith(requestUser.userId);
    });

    it('should not have returned value', async () => {
      const result = await userController.update(requestUser, {
        name: 'updated name',
      });

      expect(result).toBeUndefined();
    });
  });
});

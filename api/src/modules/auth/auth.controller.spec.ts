import { User } from '@/modules/user/entities/user.entity';
import { createUserDtoFactory } from '@/test/factories/dto/create-user.dto.factory';
import { userFactory } from '@/test/factories/entity/user.factory';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import AuthProviders from '../../shared/enums/auth-providers.enum';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './utils/guards/jwt.guard';

const createUserDto: CreateUserDto = createUserDtoFactory();

const userDto: User = userFactory();

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
            signUp: jest.fn().mockResolvedValue(userDto),
            login: jest.fn().mockResolvedValue({
              access_token: 'token',
            }),
            logout: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    mockedAuthService = module.get<jest.Mocked<AuthService>>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(mockedAuthService).toBeDefined();
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with correct parameters', async () => {
      await authController.signUp(createUserDto);

      expect(mockedAuthService.signUp).toHaveBeenCalledWith(
        AuthProviders.LOCAL,
        createUserDto,
      );
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      await authController.login(userDto);

      expect(mockedAuthService.login).toHaveBeenCalledWith(userDto);
    });

    it('should return access token', async () => {
      const result = await authController.login(userDto);

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
      await authController.loginGoogleCallback(userDto);

      expect(mockedAuthService.login).toHaveBeenCalledWith(userDto);
    });

    it('should return access token', async () => {
      const result = await authController.loginGoogleCallback(userDto);

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

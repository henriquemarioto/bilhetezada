import { Logout } from '@/modules/auth/entities/logout.entity';
import { User } from '@/modules/user/entities/user.entity';
import { userFactory } from '@/test/factories/entity/user.factory';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import AuthProviders from '../../../shared/enums/auth-providers.enum';
import CryptoService from '../../shared/services/crypto.service';
import { UserService } from '../../user/services/user.service';
import { AuthService, GoogleUser } from './auth.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockedUser: User = userFactory();

const { password: _, ...mockedUserWithoutPassword } = mockedUser;

describe('AuthService', () => {
  let authService: AuthService;
  let mockedUserService: jest.Mocked<UserService>;
  let mockedCryptoService: jest.Mocked<CryptoService>;
  let mockedJwtService: jest.Mocked<JwtService>;
  let logoutRepository: MockRepository<Logout>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockedUserWithoutPassword),
            findByEmailOrDocument: jest.fn().mockResolvedValue(mockedUser),
          },
        },
        {
          provide: CryptoService,
          useValue: {
            encrypt: jest.fn().mockReturnValue('encryptedValue'),
            compareHashWithSalt: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwtToken'),
          },
        },
        {
          provide: getRepositoryToken(Logout),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 'id',
              token: 'token',
            }),
            save: jest.fn().mockResolvedValue({
              id: 'id',
              token: 'token',
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mockedUserService = module.get<jest.Mocked<UserService>>(UserService);
    mockedCryptoService = module.get<jest.Mocked<CryptoService>>(CryptoService);
    mockedJwtService = module.get<jest.Mocked<JwtService>>(JwtService);
    logoutRepository = module.get<MockRepository<Logout>>(
      getRepositoryToken(Logout),
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(mockedUserService).toBeDefined();
    expect(mockedCryptoService).toBeDefined();
    expect(mockedJwtService).toBeDefined();
    expect(logoutRepository).toBeDefined();
  });

  describe('googleLogin', () => {
    const googleUser: GoogleUser = {
      email: 'testEmail',
      firstName: 'test',
      picture: 'pictureUrl',
      accessToken: 'token',
    };

    it('should return user with message', async () => {
      const result = authService.googleLogin({
        user: googleUser,
      } as unknown as Request);

      expect(result).toStrictEqual({
        message: 'Logado',
        user: googleUser,
      });
    });
  });

  describe('signUp', () => {
    it('should return data from UserService.create', async () => {
      const result = await authService.signUp(AuthProviders.LOCAL, {
        name: 'name',
        email: 'email',
        password: 'password',
      });

      expect(result).toStrictEqual(mockedUserWithoutPassword);
      expect(mockedUserService.create).toHaveBeenCalledWith(
        AuthProviders.LOCAL,
        {
          name: 'name',
          email: 'email',
          password: 'password',
        },
      );
    });
  });

  describe('login', () => {
    it('should return the jwt token', async () => {
      const result = await authService.login({
        id: 'id',
        name: 'name',
      } as User);

      expect(result).toStrictEqual({
        access_token: 'jwtToken',
      });
      expect(mockedJwtService.sign).toHaveBeenCalledWith({
        username: 'name',
        sub: 'id',
      });
    });
  });

  describe('validateUser', () => {
    it('should validate user with correct email and password using local provider', async () => {
      const result = await authService.validateUser(
        AuthProviders.LOCAL,
        'email',
        'password',
      );

      expect(result).toStrictEqual(mockedUserWithoutPassword);
      expect(mockedUserService.findByEmailOrDocument).toHaveBeenCalledWith(
        'encryptedValue',
      );
      expect(mockedCryptoService.encrypt).toHaveBeenCalledWith('email');
      expect(mockedCryptoService.compareHashWithSalt).toHaveBeenCalledWith(
        'password',
        mockedUser.password,
      );
    });

    it('should validate user with correct email without password using google provider', async () => {
      const result = await authService.validateUser(
        AuthProviders.GOOGLE,
        'email',
      );

      expect(result).toStrictEqual(mockedUserWithoutPassword);
      expect(mockedUserService.findByEmailOrDocument).toHaveBeenCalledWith(
        'encryptedValue',
      );
      expect(mockedCryptoService.encrypt).toHaveBeenCalledWith('email');
      expect(mockedCryptoService.compareHashWithSalt).not.toHaveBeenCalled();
    });

    it('should return null if user not exist', async () => {
      mockedUserService.findByEmailOrDocument.mockClear();

      mockedUserService.findByEmailOrDocument.mockResolvedValue(null);

      const result = await authService.validateUser(
        AuthProviders.LOCAL,
        'email',
        'password',
      );

      expect(result).toBeNull();
      expect(mockedUserService.findByEmailOrDocument).toHaveBeenCalled();
      expect(mockedCryptoService.encrypt).toHaveBeenCalled();
    });

    it('should throw a UnauthorizedException when active is false', async () => {
      const mockUserUnactive = { ...mockedUser };

      mockUserUnactive.active = false;

      mockedUserService.findByEmailOrDocument.mockClear();

      mockedUserService.findByEmailOrDocument.mockResolvedValue(
        mockUserUnactive as User,
      );

      await expect(
        authService.validateUser(AuthProviders.LOCAL, 'email', 'password'),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockedUserService.findByEmailOrDocument).toHaveBeenCalled();
      expect(mockedCryptoService.encrypt).toHaveBeenCalled();
    });

    it('should return UnauthorizedException if password not match using local provider', async () => {
      mockedCryptoService.compareHashWithSalt.mockReturnValue(false);

      await expect(
        authService.validateUser(AuthProviders.LOCAL, 'email', 'password'),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockedUserService.findByEmailOrDocument).toHaveBeenCalled();
      expect(mockedCryptoService.encrypt).toHaveBeenCalled();
      expect(mockedCryptoService.compareHashWithSalt).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should be logout', async () => {
      const result = await authService.logout('token');

      expect(result).toBe(true);
      expect(logoutRepository.save).toHaveBeenCalledWith({
        token: 'token',
      });
    });

    it('should throw a error if repository have a error', async () => {
      logoutRepository.save.mockRejectedValue(new Error());

      await expect(authService.logout('token')).rejects.toThrow();
    });
  });

  describe('hasLogout', () => {
    it('should return true if logout has made', async () => {
      const result = await authService.hasLogout('token');

      expect(result).toBe(true);
      expect(logoutRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'token' },
      });
    });

    it('should return false if logout has not made', async () => {
      logoutRepository.findOne.mockResolvedValue(null);

      const result = await authService.hasLogout('token');

      expect(result).toBe(false);
      expect(logoutRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'token' },
      });
    });

    it('should throw a error if repository have a error', async () => {
      logoutRepository.findOne.mockRejectedValue(new Error());

      await expect(authService.hasLogout('token')).rejects.toThrow();
    });
  });
});

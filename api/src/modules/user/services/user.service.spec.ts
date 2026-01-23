import { User } from '@/modules/user/entities/user.entity';
import { createUserDtoFactory } from '@/test/factories/dto/create-user.dto.factory';
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AuthProviders from '../../shared/enums/auth-providers.enum';
import CryptoService from '../shared/services/crypto.service';
import { SlugService } from '../shared/services/slug.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './services/user.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let userService: UserService;
  let cryptoService: jest.Mocked<CryptoService>;
  let slugService: jest.Mocked<SlugService>;
  let repository: MockRepository<User>;
  let findByEmailOrDocumentSpy: jest.SpyInstance<Promise<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CryptoService,
          useValue: {
            encrypt: jest.fn(),
            hashSalt: jest.fn(),
          },
        },
        {
          provide: SlugService,
          useValue: {
            slug: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    cryptoService = module.get<jest.Mocked<CryptoService>>(CryptoService);
    slugService = module.get<jest.Mocked<SlugService>>(SlugService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));

    cryptoService.encrypt
      .mockReturnValueOnce('encryptedEmail')
      .mockReturnValueOnce('encryptedDocument');

    findByEmailOrDocumentSpy = jest.spyOn(userService, 'findByEmailOrDocument');

    cryptoService.hashSalt.mockReturnValue('encryptedPassword');

    slugService.slug.mockReturnValue('pictureUrlWithUserNameSlug');
  });

  it('must be defined', () => {
    expect(userService).toBeDefined();
    expect(cryptoService).toBeDefined();
    expect(slugService).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = createUserDtoFactory();

    it('should create and return user data without password', async () => {
      const repositorySaveResult = {
        id: 'UUID',
        name: createUserDto.name,
        email: 'encryptedEmail',
        password: 'encryptedPassword',
        document: 'encryptedDocument',
        picture_url: 'pictureUrlWithUserNameSlug',
        auth_provider: AuthProviders.LOCAL,
      };

      findByEmailOrDocumentSpy.mockResolvedValue(null);

      repository.save.mockResolvedValue(repositorySaveResult);

      const { password, ...expectedResult } = repositorySaveResult;

      const result = await userService.create(
        AuthProviders.LOCAL,
        createUserDto,
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual(expectedResult);
      expect(cryptoService.encrypt).toHaveBeenNthCalledWith(
        1,
        createUserDto.email,
      );
      expect(cryptoService.encrypt).toHaveBeenNthCalledWith(
        2,
        createUserDto.document,
      );
      expect(cryptoService.hashSalt).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(findByEmailOrDocumentSpy).toHaveBeenCalledWith(
        'encryptedEmail',
        'encryptedDocument',
      );
      expect(slugService.slug).toHaveBeenCalledWith(createUserDto.name);
      expect(repository.save).toHaveBeenCalledWith({
        ...createUserDto,
        email: 'encryptedEmail',
        document: 'encryptedDocument',
        password: 'encryptedPassword',
        picture_url: `https://api.dicebear.com/9.x/identicon/svg?seed=pictureUrlWithUserNameSlug`,
        auth_provider: AuthProviders.LOCAL,
      });

      findByEmailOrDocumentSpy.mockRestore();
    });

    it('should create a user without some informations with Google login', async () => {
      const {
        password: _password,
        document: _document,
        birth_date: _birth_date,
        ...googleUserDto
      } = createUserDto;

      googleUserDto.picture_url = 'googlePictureUrl';

      const repositorySaveResult = {
        id: 'UUID',
        name: googleUserDto.name,
        email: 'encryptedEmail',
        password: null,
        document: null,
        picture_url: googleUserDto.picture_url,
        auth_provider: AuthProviders.GOOGLE,
      };

      findByEmailOrDocumentSpy.mockResolvedValue(null);

      repository.save.mockResolvedValue(repositorySaveResult);

      const { password: _resultPassword, ...expectedResult } =
        repositorySaveResult;

      const result = await userService.create(
        AuthProviders.GOOGLE,
        googleUserDto,
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual(expectedResult);
      expect(cryptoService.encrypt).toHaveBeenNthCalledWith(
        1,
        createUserDto.email,
      );
      expect(cryptoService.encrypt).not.toHaveBeenNthCalledWith(2);
      expect(findByEmailOrDocumentSpy).toHaveBeenCalledWith(
        'encryptedEmail',
        undefined,
      );
      expect(cryptoService.hashSalt).not.toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith({
        ...googleUserDto,
        email: 'encryptedEmail',
        auth_provider: AuthProviders.GOOGLE,
      });

      findByEmailOrDocumentSpy.mockRestore();
    });

    it('should not create a LOCAL user without document', async () => {
      const { document, ...userDtoWithoutDocument } = createUserDto;
      await expect(
        userService.create(AuthProviders.LOCAL, userDtoWithoutDocument),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an ConflictException when email or document is already in use', async () => {
      findByEmailOrDocumentSpy.mockResolvedValue({} as User);

      await expect(
        userService.create(AuthProviders.LOCAL, createUserDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmailOrDocument', () => {
    it('sholud return the user if found with the document', async () => {
      repository.findOne.mockReturnValue({
        name: 'name',
        document: 'document',
      });

      const result = await userService.findByEmailOrDocument(
        undefined,
        'document',
      );

      expect(result).toBeDefined();
      expect(result.name).toBe('name');
      expect(result.document).toBe('document');
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('sholud return the user if found with the email', async () => {
      repository.findOne.mockReturnValue({
        name: 'name',
        email: 'email',
      });

      const result = await userService.findByEmailOrDocument(
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

      const result = await userService.findByEmailOrDocument(
        'email',
        'document',
      );

      expect(result).toBe(null);
      expect(repository.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('getById', () => {
    it('should be return user if exists', async () => {
      repository.findOne.mockReturnValue({
        name: 'name',
        document: 'document',
        email: 'email',
      });

      const result = await userService.getById('id');

      expect(result).toBeDefined();
      expect(result).toEqual({
        name: 'name',
        document: 'document',
        email: 'email',
      });
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should be return null if user not exists', async () => {
      repository.findOne.mockReturnValue(null);

      const result = await userService.getById('id');

      expect(result).toBe(null);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of user', async () => {
      repository.find.mockReturnValue([{ name: 'name1' }, { name: 'name2' }]);

      const result = await userService.findAll();

      expect(result).toBeDefined();
      expect(result).toStrictEqual([{ name: 'name1' }, { name: 'name2' }]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return NotFoundException if no exists any user', async () => {
      repository.find.mockReturnValue([]);
      await expect(userService.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return true if user is uptdated successfuly', async () => {
      repository.update.mockReturnValue({ name: 'updated name' });

      const result = await userService.update('id', {
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

      const result = await userService.update('id', {
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
      repository.update.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        userService.update('id', {
          name: 'updated name',
          password: 'password',
          email: 'email',
          document: 'document',
        }),
      ).rejects.toThrow(InternalServerErrorException);
      expect(repository.update).toHaveBeenCalledWith('id', {
        name: 'updated name',
        password: 'encryptedPassword',
        email: 'encryptedEmail',
        document: 'encryptedDocument',
      });
    });
  });

  describe('disable', () => {
    it('should disable a user', async () => {
      repository.update.mockResolvedValue(true);

      const result = await userService.disable('id');

      expect(result).toBe(true);
      expect(repository.update).toHaveBeenCalledWith('id', { active: false });
    });

    it('should throw InternalServerErrorException if delete fails', async () => {
      repository.update.mockImplementation(() => {
        throw new Error();
      });

      await expect(userService.disable('id')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.update).toHaveBeenCalledWith('id', { active: false });
    });
  });
});

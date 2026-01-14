import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const createUserDto: CreateUserDto = new CreateUserDto();

  beforeEach(() => {
    createUserDto.name = 'John Doe';
    createUserDto.document = '12345678909';
    createUserDto.birth_date = '2000-10-10T00:00:00.000Z';
    createUserDto.email = 'test@email.com';
    createUserDto.password = '123456789AbCd!@#';
    createUserDto.picture_url = 'https://example.com/image.jpg';
  });

  it('should validade all data correctly', async () => {
    expect((await validate(createUserDto)).length).toBe(0);
  });

  it('should return an error if name is not a string', async () => {
    createUserDto.name = 123 as any;
    expect((await validate(createUserDto)).length).toBe(1);
  });

  it('should return an error if document is not a string', async () => {
    createUserDto.document = 12345678909 as any;
    expect((await validate(createUserDto)).length).toBe(1);
  });

  it('should return an error if document is not a valid CPF or CNPJ', async () => {
    createUserDto.document = '123' as any;
    expect((await validate(createUserDto)).length).toBe(1);
  });

  it('should return an error if birth_date is not a valid date', async () => {
    createUserDto.birth_date = '2000/10/10' as any;
    expect((await validate(createUserDto)).length).toBe(1);
  });

  it('should return an error if email is not a valid email', async () => {
    createUserDto.email = 'invalid-email' as any;
    expect((await validate(createUserDto)).length).toBe(1);
  });

  it('should return an error if password is not a strong password', async () => {
    createUserDto.password = 'invalid-password' as any;
    expect((await validate(createUserDto)).length).toBe(1);
  });

  it('should return an error if picture_url is not a valid URL', async () => {
    createUserDto.picture_url = 'invalid-url' as any;
    expect((await validate(createUserDto)).length).toBe(1);
  });

  it('should not return an error if picture_url is not provided', async () => {
    const { picture_url, ...restCreateUserDto } = createUserDto;
    expect((await validate(restCreateUserDto)).length).toBe(0);
  });
});

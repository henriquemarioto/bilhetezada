import { validate } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

describe('CreateCustomerDto', () => {
  const createCustomerDto: CreateCustomerDto = new CreateCustomerDto();

  beforeEach(() => {
    createCustomerDto.name = 'John Doe';
    createCustomerDto.document = '12345678909';
    createCustomerDto.birth_date = '2000-10-10T00:00:00.000Z';
    createCustomerDto.email = 'test@email.com';
    createCustomerDto.password = '123456789AbCd!@#';
    createCustomerDto.picture_url = 'https://example.com/image.jpg';
  });

  it('should validade all data correctly', async () => {
    expect((await validate(createCustomerDto)).length).toBe(0);
  });

  it('should return an error if name is not a string', async () => {
    createCustomerDto.name = 123 as any;
    expect((await validate(createCustomerDto)).length).toBe(1);
  });

  it('should return an error if document is not a string', async () => {
    createCustomerDto.document = 12345678909 as any;
    expect((await validate(createCustomerDto)).length).toBe(1);
  });

  it('should return an error if document is not a valid CPF or CNPJ', async () => {
    createCustomerDto.document = '123' as any;
    expect((await validate(createCustomerDto)).length).toBe(1);
  });

  it('should return an error if birth_date is not a valid date', async () => {
    createCustomerDto.birth_date = '2000/10/10' as any;
    expect((await validate(createCustomerDto)).length).toBe(1);
  });

  it('should return an error if email is not a valid email', async () => {
    createCustomerDto.email = 'invalid-email' as any;
    expect((await validate(createCustomerDto)).length).toBe(1);
  });

  it('should return an error if password is not a strong password', async () => {
    createCustomerDto.password = 'invalid-password' as any;
    expect((await validate(createCustomerDto)).length).toBe(1);
  });

  it('should return an error if picture_url is not a valid URL', async () => {
    createCustomerDto.picture_url = 'invalid-url' as any;
    expect((await validate(createCustomerDto)).length).toBe(1);
  });

  it('should not return an error if picture_url is not provided', async () => {
    const { picture_url, ...restCreateCustomerDto } = createCustomerDto;
    expect((await validate(restCreateCustomerDto)).length).toBe(0);
  });
});

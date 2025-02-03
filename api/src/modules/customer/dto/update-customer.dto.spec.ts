import { validate } from 'class-validator';
import { UpdateCustomerDto } from './update-customer.dto';
import { plainToInstance } from 'class-transformer';

describe('UpdateCustomerDto', () => {
  const updateCustomerDto: UpdateCustomerDto = new UpdateCustomerDto();

  beforeEach(() => {
    updateCustomerDto.name = 'John Doe';
    updateCustomerDto.document = '12345678909';
    updateCustomerDto.birth_date = '2000-10-10T00:00:00.000Z';
    updateCustomerDto.email = 'test@email.com';
    updateCustomerDto.password = '123456789AbCd!@#';
    updateCustomerDto.picture_url = 'https://example.com/image.jpg';
  });

  it('should not throw any error', async () => {
    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
  });

  it('should not throw any error when name is missing', async () => {
    updateCustomerDto.name = undefined;
    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
  });

  it('should not throw any error when document is missing', async () => {
    updateCustomerDto.document = undefined;
    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
  });

  it('should not throw any error when birth_date is missing', async () => {
    updateCustomerDto.birth_date = undefined;
    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
  });

  it('should not throw any error when email is missing', async () => {
    updateCustomerDto.email = undefined;
    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
  });

  it('should not throw any error when password is missing', async () => {
    updateCustomerDto.password = undefined;
    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
  });

  it('should not throw any error when picture_url is missing', async () => {
    updateCustomerDto.picture_url = undefined;
    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
  });

  it('should exclude active property', async () => {
    updateCustomerDto.active = false;

    await expect(validate(updateCustomerDto)).resolves.not.toThrow();
    expect(
      plainToInstance(UpdateCustomerDto, updateCustomerDto),
    ).not.toHaveProperty('active');
  });
});

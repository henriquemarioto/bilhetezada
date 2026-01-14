import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  const updateUserDto: UpdateUserDto = new UpdateUserDto();

  beforeEach(() => {
    updateUserDto.name = 'John Doe';
    updateUserDto.document = '12345678909';
    updateUserDto.birth_date = '2000-10-10T00:00:00.000Z';
    updateUserDto.email = 'test@email.com';
    updateUserDto.password = '123456789AbCd!@#';
    updateUserDto.picture_url = 'https://example.com/image.jpg';
  });

  it('should not throw any error', async () => {
    await expect(validate(updateUserDto)).resolves.not.toThrow();
  });

  it('should not throw any error when name is missing', async () => {
    updateUserDto.name = undefined;
    await expect(validate(updateUserDto)).resolves.not.toThrow();
  });

  it('should not throw any error when document is missing', async () => {
    updateUserDto.document = undefined;
    await expect(validate(updateUserDto)).resolves.not.toThrow();
  });

  it('should not throw any error when birth_date is missing', async () => {
    updateUserDto.birth_date = undefined;
    await expect(validate(updateUserDto)).resolves.not.toThrow();
  });

  it('should not throw any error when email is missing', async () => {
    updateUserDto.email = undefined;
    await expect(validate(updateUserDto)).resolves.not.toThrow();
  });

  it('should not throw any error when password is missing', async () => {
    updateUserDto.password = undefined;
    await expect(validate(updateUserDto)).resolves.not.toThrow();
  });

  it('should not throw any error when picture_url is missing', async () => {
    updateUserDto.picture_url = undefined;
    await expect(validate(updateUserDto)).resolves.not.toThrow();
  });

  it('should exclude active property', async () => {
    updateUserDto.active = false;

    await expect(validate(updateUserDto)).resolves.not.toThrow();
    expect(plainToInstance(UpdateUserDto, updateUserDto)).not.toHaveProperty(
      'active',
    );
  });
});

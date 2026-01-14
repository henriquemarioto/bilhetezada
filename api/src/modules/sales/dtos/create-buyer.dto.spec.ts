import { validate } from 'class-validator';
import { CreateBuyerDto } from './create-buyer.dto';
import { createBuyerDtoFactory } from '@/test/factories/dto/create-buyer.dto.factory';

describe('CreateBuyerDto', () => {
  const createBuyerDto: CreateBuyerDto = new CreateBuyerDto();
  const mockedCreateBuyerDto = createBuyerDtoFactory();

  beforeEach(() => {
    createBuyerDto.name = mockedCreateBuyerDto.name;
    createBuyerDto.email = mockedCreateBuyerDto.email;
    createBuyerDto.phone = mockedCreateBuyerDto.phone;
  });

  it('should be defined', () => {
    expect(createBuyerDto).toBeDefined();
  });

  it('should be valid', async () => {
    await expect(validate(createBuyerDto)).resolves.toHaveLength(0);
  });

  it('should be invalid if name is empty', async () => {
    createBuyerDto.name = '';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);
  });

  it('should be invalid if name not exists', async () => {
    delete createBuyerDto.name;
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);
  });

  it('should be invalid if email is not a valid email', async () => {
    createBuyerDto.email = 'email.com';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);

    createBuyerDto.email = '';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);
  });

  it('should be invalid if email not exists', async () => {
    delete createBuyerDto.email;
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);
  });

  it('should be invalid if phone is not a valid phone', async () => {
    createBuyerDto.phone = '41987641273';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);

    createBuyerDto.phone = '+41987641273';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);

    createBuyerDto.phone = '+41 987641273';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);

    createBuyerDto.phone = '+4198 7641273';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);

    createBuyerDto.phone = '';
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);
  });

  it('should be invalid if phone not exists', async () => {
    delete createBuyerDto.phone;
    await expect(validate(createBuyerDto)).resolves.toHaveLength(1);
  });
});

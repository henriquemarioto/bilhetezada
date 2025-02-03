import { validate } from 'class-validator';
import { CreateBuyerDto } from './create-buyer.dto';
import { createBuyerDtoFactory } from '@/test/factories/dto/create-buyer.dto.factory';
import { CreateOrderDto } from './create-order.dto';
import { createOrderDtoFactory } from '@/test/factories/dto/create-order.dto.factory';

describe('CreateOrderDto', () => {
  const createOrderDto: CreateOrderDto = new CreateOrderDto();
  const mockedCreateOrderDto = createOrderDtoFactory();

  beforeEach(() => {
    createOrderDto.eventId = mockedCreateOrderDto.eventId;
    createOrderDto.buyer = mockedCreateOrderDto.buyer;
  });

  it('should be defined', () => {
    expect(createOrderDto).toBeDefined();
  });

  it('should be valid', async () => {
    await expect(validate(createOrderDto)).resolves.toHaveLength(0);
  });

  it('should be invalid if eventId not exists', async () => {
    delete createOrderDto.eventId;
    await expect(validate(createOrderDto)).resolves.toHaveLength(1);
  });

  it('should be invalid if eventId is not uuid', async () => {
    createOrderDto.eventId = '12jh3ki1j2hjk';
    await expect(validate(createOrderDto)).resolves.toHaveLength(1);
  });

  it('should be invalid if buyer not exists', async () => {
    delete createOrderDto.buyer;
    await expect(validate(createOrderDto)).resolves.toHaveLength(1);
  });
});

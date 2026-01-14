import { createOrderDtoFactory } from '@/test/factories/dto/create-ticket-order.dto.factory';
import { validate } from 'class-validator';
import { CreateTicketOrderDto } from './create-ticket-order.dto';

describe('CreateTicketOrderDto', () => {
  const createOrderDto: CreateTicketOrderDto = new CreateTicketOrderDto();
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

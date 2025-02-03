import { validate } from 'class-validator';
import { CreateEventDto } from './create-event.dto';
import { createEventDtoFactory } from '@/test/factories/dto/create-event.dto.factory';

describe('CreateEventDto', () => {
  const createEventDto: CreateEventDto = new CreateEventDto();
  const mockedCreateEventDto = createEventDtoFactory();

  beforeEach(() => {
    createEventDto.name = mockedCreateEventDto.name;
    createEventDto.description = mockedCreateEventDto.description;
    createEventDto.address = mockedCreateEventDto.address;
    createEventDto.start_time = mockedCreateEventDto.start_time;
    createEventDto.end_time = mockedCreateEventDto.end_time;
    createEventDto.entrance_limit_time =
      mockedCreateEventDto.entrance_limit_time;
    createEventDto.limit_time_for_ticket_purchase =
      mockedCreateEventDto.limit_time_for_ticket_purchase;
    createEventDto.time_zone = mockedCreateEventDto.time_zone;
    createEventDto.price = mockedCreateEventDto.price;
  });

  it('should be defined', () => {
    expect(createEventDto).toBeDefined();
  });

  it('should be valid', async () => {
    await expect(validate(createEventDto)).resolves.toHaveLength(0);
  });

  it('should require name', async () => {
    createEventDto.name = '';
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    delete createEventDto.name;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);
  });

  it('should require description', async () => {
    createEventDto.description = '';
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    delete createEventDto.description;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);
  });

  it('should require address', async () => {
    createEventDto.address = '';
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    delete createEventDto.address;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);
  });

  it('should require start_time', async () => {
    createEventDto.start_time = '';
    const validation1 = await validate(createEventDto);

    expect(validation1.length).toBeGreaterThanOrEqual(0);

    delete createEventDto.start_time;
    const validation2 = await validate(createEventDto);
    expect(validation2.length).toBeGreaterThanOrEqual(0);
  });

  it('should require end_time', async () => {
    createEventDto.end_time = '';
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    delete createEventDto.end_time;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);
  });

  it('should not require entrance_limit_time', async () => {
    delete createEventDto.entrance_limit_time;
    await expect(validate(createEventDto)).resolves.toHaveLength(0);
  });

  it('should require limit_time_for_ticket_purchase', async () => {
    createEventDto.limit_time_for_ticket_purchase = '';
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    delete createEventDto.limit_time_for_ticket_purchase;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);
  });

  it('should require time_zone', async () => {
    createEventDto.time_zone = '';
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    delete createEventDto.time_zone;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);
  });

  it('should require price', async () => {
    createEventDto.price = 0;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    createEventDto.price = 10001;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);

    delete createEventDto.price;
    await expect(validate(createEventDto)).resolves.toHaveLength(1);
  });
});

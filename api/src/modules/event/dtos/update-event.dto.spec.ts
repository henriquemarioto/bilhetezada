import { validate } from 'class-validator';
import { UpdateEventDTO } from './update-event.dto';
import { createEventDtoFactory } from '@/test/factories/dto/create-event.dto.factory';

describe('UpdateEventDto', () => {
  const updateEventDto: UpdateEventDTO = new UpdateEventDTO();
  const mockedCreateEventDto = createEventDtoFactory();

  beforeEach(() => {
    updateEventDto.name = mockedCreateEventDto.name;
    updateEventDto.description = mockedCreateEventDto.description;
    updateEventDto.address = mockedCreateEventDto.address;
    updateEventDto.start_time = mockedCreateEventDto.start_time;
    updateEventDto.end_time = mockedCreateEventDto.end_time;
    updateEventDto.entrance_limit_time =
      mockedCreateEventDto.entrance_limit_time;
    updateEventDto.limit_time_for_ticket_purchase =
      mockedCreateEventDto.limit_time_for_ticket_purchase;
    updateEventDto.time_zone = mockedCreateEventDto.time_zone;
    updateEventDto.price = mockedCreateEventDto.price;
  });

  it('should be defined', () => {
    expect(updateEventDto).toBeDefined();
  });

  it('should be able to validate the update event dto', async () => {
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when name is missing', async () => {
    delete updateEventDto.name;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when description is missing', async () => {
    delete updateEventDto.description;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when address is missing', async () => {
    delete updateEventDto.address;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when start_time is missing without dependencies', async () => {
    delete updateEventDto.start_time;
    delete updateEventDto.end_time;
    delete updateEventDto.entrance_limit_time;
    delete updateEventDto.limit_time_for_ticket_purchase;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should throw error when start_time is missing with dependencies', async () => {
    delete updateEventDto.start_time;
    const result = await validate(updateEventDto);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should not throw any error when end_time is missing', async () => {
    delete updateEventDto.end_time;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when entrance_limit_time is missing', async () => {
    delete updateEventDto.entrance_limit_time;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when limit_time_for_ticket_purchase is missing', async () => {
    delete updateEventDto.limit_time_for_ticket_purchase;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when time_zone is missing', async () => {
    delete updateEventDto.time_zone;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });

  it('should not throw any error when price is missing', async () => {
    delete updateEventDto.price;
    await expect(validate(updateEventDto)).resolves.toHaveLength(0);
  });
});

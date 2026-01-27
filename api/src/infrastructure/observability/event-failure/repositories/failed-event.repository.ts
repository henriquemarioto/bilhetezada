import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FailedEvent } from '../entities/failed-event.entity';
import { FailedEventStatus } from '../enums/failed-event-status.enum';
import { AxiosError } from 'axios';

@Injectable()
export class FailedEventRepository extends TypeOrmBaseRepository<FailedEvent> {
  constructor(
    @InjectRepository(FailedEvent)
    private readonly failedEventRepository: Repository<FailedEvent>,
  ) {
    super(failedEventRepository);
  }

  async saveFailure(
    eventName: string,
    eventSource: string,
    payload: Record<string, any>,
    error: Error | AxiosError | unknown,
  ): Promise<FailedEvent> {
    return this.createImplementation({
      eventName,
      eventSource,
      payload,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack:
        error instanceof Error
          ? error.stack
          : error instanceof AxiosError
            ? JSON.stringify(error.response?.data)
            : null,
      status: FailedEventStatus.PENDING,
      attempts: 1,
      lastAttemptAt: new Date(),
    });
  }
}

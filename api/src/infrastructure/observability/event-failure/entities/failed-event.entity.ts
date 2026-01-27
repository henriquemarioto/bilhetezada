import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FailedEventStatus } from '../enums/failed-event-status.enum';

@Entity('failed_events')
export class FailedEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_name', type: 'varchar' })
  eventName: string;

  @Column({ name: 'event_source', type: 'varchar' })
  eventSource: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ name: 'error_message', type: 'text' })
  errorMessage: string;

  @Column({ name: 'error_stack', type: 'text', nullable: true })
  errorStack: string | null;

  @Column({
    type: 'enum',
    enum: FailedEventStatus,
    default: FailedEventStatus.PENDING,
  })
  status: FailedEventStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ name: 'max_attempts', type: 'int', default: 3 })
  maxAttempts: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'last_attempt_at', type: 'timestamp', nullable: true })
  lastAttemptAt: Date | null;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date | null;
}

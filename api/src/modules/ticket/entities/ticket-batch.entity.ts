import { OrderItem } from '@/modules/sales/entities/order-item.entity';
import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '@/modules/event/entities/event.entity';
import { TicketBatchStatus } from '@/shared/enums/ticket-batch-status.enum';

@Entity('ticket_batch')
export class TicketBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'int', unsigned: true })
  amount: number;

  @Column({ nullable: false, type: 'int', unsigned: true })
  quantity: number;

  @Column({ nullable: false, type: 'int', unsigned: true, default: 0 })
  sold: number;

  @Column({ nullable: false, type: 'datetime' })
  start_at: string;

  @Column({ nullable: false, type: 'datetime' })
  end_at: string;

  @Column({ type: 'enum', enum: TicketBatchStatus, default: TicketBatchStatus.SCHEDULED })
  status: TicketBatchStatus;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => Event, (event) => event.batches)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'event_id' })
  event_id: string;

  @OneToMany(() => Ticket, (ticket) => ticket.ticket_batch)
  tickets: Ticket[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.ticket_batch, {
    nullable: true,
  })
  order_items: OrderItem[] | [];
}

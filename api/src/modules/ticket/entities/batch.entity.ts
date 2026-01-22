import { Event } from '@/modules/event/entities/event.entity';
import { OrderItem } from '@/modules/sales/entities/order-item.entity';
import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import { BatchStatus } from '@/shared/enums/ticket-batch-status.enum';
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
import { TicketType } from './ticket-type.entity';

@Entity('batch')
export class Batch {
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

  @Column({ nullable: false, type: 'timestamptz' })
  start_at: string;

  @Column({ nullable: false, type: 'timestamptz' })
  end_at: string;

  @Column({ type: 'enum', enum: BatchStatus, default: BatchStatus.SCHEDULED })
  status: BatchStatus;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => Event, (event) => event.batches)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'event_id' })
  event_id: string;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.batches)
  @JoinColumn({ name: 'ticket_type_id' })
  ticket_type: TicketType;

  @Column({ name: 'ticket_type_id' })
  ticket_type_id: string;

  @OneToMany(() => Ticket, (ticket) => ticket.batch)
  tickets: Ticket[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.batch, {
    nullable: true,
  })
  order_items: OrderItem[] | [];
}

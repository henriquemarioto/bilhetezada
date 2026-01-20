import { Event } from '@/modules/event/entities/event.entity';
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
import { Batch } from './batch.entity';

@Entity('ticket_type')
export class TicketType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 50 })
  name: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => Event, (event) => event.ticket_types, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'event_id', nullable: false })
  eventId: string;

  @OneToMany(() => Ticket, (ticket) => ticket.batch)
  tickets: Ticket[];

  @OneToMany(() => Batch, (batch) => batch.ticket_type)
  batches: Batch[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.ticket_type)
  order_items: OrderItem[];
}

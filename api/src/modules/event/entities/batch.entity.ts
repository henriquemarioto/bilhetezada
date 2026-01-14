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
import { Event } from './event.entity';
import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import { OrderItem } from '@/modules/sales/entities/order-item.entity';

@Entity()
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'int', unsigned: true })
  amount: number;

  @Column({ nullable: false, type: 'int', unsigned: true })
  ticket_quantity: number;

  @Column({ nullable: false, type: 'datetime' })
  start_time: string;

  @Column({ nullable: false, type: 'datetime' })
  end_time: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.batches)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'event_id' })
  event_id: string;

  @OneToMany(() => Ticket, (ticket) => ticket.batch)
  tickets: Ticket[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.batch, {
    nullable: true,
  })
  order_items: OrderItem[] | [];
}

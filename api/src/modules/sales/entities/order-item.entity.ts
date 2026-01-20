import { Batch } from '@/modules/ticket/entities/batch.entity';
import { TicketType } from '@/modules/ticket/entities/ticket-type.entity';
import { Ticket } from '@/modules/ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'int' })
  total_amount: number;

  @Column({ nullable: false, type: 'tinyint', unsigned: true })
  ticket_quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  order_id: string;

  @ManyToOne(() => Batch, (batch) => batch.order_items)
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batch_id: string;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.order_items)
  @JoinColumn({ name: 'ticket_type_id' })
  ticket_type: TicketType;

  @Column({ name: 'ticket_type_id' })
  ticket_type_id: string;

  @OneToMany(() => Ticket, (Ticket) => Ticket.order_item, { nullable: true })
  tickets: Ticket[] | [];
}

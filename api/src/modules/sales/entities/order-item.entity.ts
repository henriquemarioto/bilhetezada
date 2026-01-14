import { TicketBatch } from '@/modules/ticket/entities/ticket-batch.entity';
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

  @ManyToOne(() => TicketBatch, (ticketBatch) => ticketBatch.order_items)
  @JoinColumn({ name: 'ticket_batch_id' })
  ticket_batch: TicketBatch;

  @Column({ name: 'ticket_batch_id' })
  ticket_batch_id: string;
  @OneToMany(() => Ticket, (Ticket) => Ticket.order_item, { nullable: true })
  tickets: Ticket[] | [];
}

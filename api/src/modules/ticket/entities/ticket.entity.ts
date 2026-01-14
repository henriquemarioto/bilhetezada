import { OrderItem } from '@/modules/sales/entities/order-item.entity';
import { TicketBatch } from '@/modules/ticket/entities/ticket-batch.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, default: false })
  used: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.tickets)
  @JoinColumn({ name: 'order_item_id' })
  order_item: OrderItem;

  @Column({ name: 'order_item_id' })
  order_item_id: string | null;

  @ManyToOne(() => TicketBatch, (ticketBatch) => ticketBatch.tickets)
  @JoinColumn({ name: 'ticket_batch_id' })
  ticket_batch: TicketBatch;

  @Column({ name: 'ticket_batch_id' })
  ticket_batch_id: string;
}

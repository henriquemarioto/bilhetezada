import { OrderItem } from '@/modules/sales/entities/order-item.entity';
import { Batch } from '@/modules/ticket/entities/batch.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketType } from './ticket-type.entity';

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

  @ManyToOne(() => Batch, (batch) => batch.tickets)
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batch_id: string;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.tickets)
  @JoinColumn({ name: 'ticket_type_id' })
  ticket_type: TicketType;

  @Column({ name: 'ticket_type_id' })
  ticket_type_id: string;
}

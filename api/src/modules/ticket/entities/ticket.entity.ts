import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Batch } from '@/modules/event/entities/batch.entity';
import { OrderItem } from '@/modules/sales/entities/order-item.entity';

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
}

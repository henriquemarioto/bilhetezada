import { Event } from '@/modules/event/entities/event.entity';
import { OrderStatus } from '@/shared/enums/order-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { Buyer } from './buyer.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'int' })
  total_amount: number;

  @Column({ nullable: false, type: 'int' })
  platform_fee_amount: number;

  @Column({ nullable: false, type: 'int' })
  gateway_fee_amount: number;

  @Column({ nullable: false, type: 'int' })
  event_organizer_amount_net: number;

  @Column({ nullable: false, type: 'tinyint', unsigned: true })
  ticket_quantity: number;

  @Column({ nullable: false, unique: true })
  transaction_reference: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.orders)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'event_id' })
  event_id: string;

  @OneToOne(() => Payment, (payment) => payment.order, {
    nullable: true,
  })
  payment: Payment | null;

  @OneToOne(() => Buyer, (buyer) => buyer.order, { nullable: true })
  buyer: Buyer | null;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  order_items: OrderItem[] | [];
}

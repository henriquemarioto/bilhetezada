import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Payment } from './payment.entity';
import { OrderStatus } from '../../../modules/shared/enums/orde-status.enum';
import { Buyer } from './buyer.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  value: number;

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

  @OneToOne(() => Payment, (payment) => payment.order, {
    nullable: true,
    cascade: ['update'],
  })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment | null;

  @OneToOne(() => Buyer, (buyer) => buyer.order)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;
}

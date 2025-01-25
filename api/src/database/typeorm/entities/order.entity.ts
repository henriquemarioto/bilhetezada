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
import { Buyer } from './buyer.entity';
import { Ticket } from './ticket.entity';
import { OrderStatus } from '../../../modules/shared/enums/order-status.enum';

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

  @Column()
  transaction_reference: string;

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

  @OneToOne(() => Buyer, (buyer) => buyer.order, { nullable: true })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer | null;

  @OneToOne(() => Ticket, (Ticket) => Ticket.order, { nullable: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket | null;
}

import { Customer } from '@/infrastructure/database/typeorm/entities/customer.entity';
import { Order } from '@/infrastructure/database/typeorm/entities/order.entity';
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

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false, length: 2 })
  state: string;

  @Column('float', { nullable: false })
  latitude: number;

  @Column('float', { nullable: false })
  longitude: number;

  @Column({ nullable: true })
  place_name: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: false, type: 'datetime' })
  start_time: string;

  @Column({ nullable: false, type: 'datetime' })
  end_time: string;

  @Column({ type: 'datetime', nullable: true })
  entrance_limit_time?: string | null;

  @Column({ nullable: false, type: 'datetime' })
  limit_time_for_ticket_purchase: string;

  @Column({ nullable: false, default: 'America/Sao_Paulo' })
  time_zone: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: false })
  capacity: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.events)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_id' })
  customer_id: string;

  @OneToMany(() => Order, (order) => order.event)
  orders: Order[];
}

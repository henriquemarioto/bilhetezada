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

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: false })
  start_time: Date;

  @Column({ nullable: false })
  end_time: Date;

  @Column({ type: 'datetime', nullable: true })
  entrance_limit_time?: Date | null;

  @Column({ nullable: false })
  limit_time_for_ticket_purchase: Date;

  @Column({ nullable: false, default: 'America/Sao_Paulo' })
  time_zone: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price: number;

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

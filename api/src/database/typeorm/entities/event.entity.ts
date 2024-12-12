import { Customer } from './customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  customerId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false })
  start_time: Date;

  @Column({ nullable: false })
  end_time: Date;

  @Column({ nullable: true })
  entrance_limit_time?: Date;

  @Column({ nullable: false, default: 'America/Sao_Paulo' })
  time_zone: string;

  @Column({ nullable: false })
  price: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;
}

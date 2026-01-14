import { Order } from '@/modules/sales/entities/order.entity';
import { User } from '@/modules/user/entities/user.entity';
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
import { Batch } from './batch.entity';

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

  @Column({ nullable: false, default: 'America/Sao_Paulo' })
  time_zone: string;

  @Column({ nullable: false, type: 'mediumint', unsigned: true })
  capacity: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'organizer_user_id' })
  user: User;

  @Column({ name: 'organizer_user_id' })
  organizer_user_id: string;

  @OneToMany(() => Batch, (batch) => batch.event)
  batches: Batch[];

  @OneToMany(() => Order, (order) => order.event)
  orders: Order[];
}

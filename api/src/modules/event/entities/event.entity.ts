import { Order } from '@/modules/sales/entities/order.entity';
import { Batch } from '@/modules/ticket/entities/batch.entity';
import { TicketType } from '@/modules/ticket/entities/ticket-type.entity';
import { User } from '@/modules/user/entities/user.entity';
import { EventStatus } from '@/shared/enums/event-status.enum';
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

  @Column({ nullable: false, type: 'timestamptz' })
  start_at: string;

  @Column({ nullable: false, type: 'timestamptz' })
  end_at: string;

  @Column({ type: 'timestamptz', nullable: true })
  entrance_limit_at?: string | null;

  @Column({ nullable: false, default: 'America/Sao_Paulo' })
  time_zone: string;

  @Column({ nullable: false, type: 'integer', unsigned: true })
  capacity: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

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

  @OneToMany(() => TicketType, (ticketType) => ticketType.event)
  ticket_types: TicketType[];

  @OneToMany(() => Order, (order) => order.event)
  orders: Order[];
}

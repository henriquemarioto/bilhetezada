import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentLinkOwner } from '../../../modules/shared/enums/payment-link-owner.enum';
import { Event } from './event.entity';

@Entity()
export class PaymentLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false, type: 'enum', enum: PaymentLinkOwner })
  owner: PaymentLinkOwner;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.paymentLinks, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}

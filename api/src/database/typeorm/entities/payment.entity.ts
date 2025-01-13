import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethods } from '../../../modules/shared/enums/payment-methods.enum';
import { Order } from './order.entity';
import { PaymentStatus } from '../../../modules/shared/enums/payment-status.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'enum', enum: PaymentMethods })
  method: PaymentMethods;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({
    default: PaymentStatus.PENDING,
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column()
  transaction_reference: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Order, (order) => order.payment, { nullable: true })
  order: Order | null;
}

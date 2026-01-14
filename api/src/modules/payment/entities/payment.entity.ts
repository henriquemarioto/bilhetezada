import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethods } from '@/shared/enums/payment-methods.enum';
import { Order } from '@/modules/sales/entities/order.entity';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { PaymentGateways } from '@/shared/enums/payment-gateways.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'enum', enum: PaymentMethods })
  method: PaymentMethods;

  @Column({ nullable: false, type: 'int', unsigned: true })
  amount: number;

  @Column({
    default: PaymentStatus.PENDING,
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column()
  transaction_reference: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PaymentGateways, nullable: false })
  gateway: PaymentGateways;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', nullable: false })
  order_id: string;
}

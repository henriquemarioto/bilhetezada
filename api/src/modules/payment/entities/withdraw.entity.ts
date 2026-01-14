import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

@Entity()
export class Withdraw {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  pix_key: string;

  @Column({ nullable: false, type: 'int', unsigned: true })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: string;
}

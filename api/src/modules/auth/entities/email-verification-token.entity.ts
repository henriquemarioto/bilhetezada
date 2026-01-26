import { User } from '@/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('email_verification_token')
export class EmailVerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  token: string;

  @Column({ type: 'timestamptz', nullable: false })
  expires_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  used_at: Date;
  
  @CreateDateColumn()
  created_at: Date;
  
  @ManyToOne(() => User, (user) => user.emailVerificationTokens, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  user_id: string;
}

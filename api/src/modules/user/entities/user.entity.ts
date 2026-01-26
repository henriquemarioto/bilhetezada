import { EmailVerificationToken } from '@/modules/auth/entities/email-verification-token.entity';
import { Event } from '@/modules/event/entities/event.entity';
import { Withdraw } from '@/modules/payment/entities/withdraw.entity';
import AuthProviders from '@/shared/enums/auth-providers.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  document: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  birth_date?: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, default: false })
  email_verified: boolean;

  @Column({ type: 'varchar', unique: true, nullable: true })
  pix_key: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'varchar', default: null })
  picture_url: string | null;

  @Column({ nullable: false, type: 'enum', enum: AuthProviders })
  auth_provider: AuthProviders;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => Withdraw, (withdraw) => withdraw.user)
  withdraws: Withdraw[];

  @OneToMany(() => EmailVerificationToken, (token) => token.user)
  emailVerificationTokens: EmailVerificationToken[];
}

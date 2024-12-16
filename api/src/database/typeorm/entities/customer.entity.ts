import AuthProviders from '../../../shared/enums/auth-providers.enum';
import { Event } from './event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, unique: true })
  document: string;

  @Column({ nullable: true, default: null })
  birth_date: Date;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ default: null })
  picture_url: string | null;

  @Column({ nullable: false, type: 'enum', enum: AuthProviders })
  auth_provider: AuthProviders;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Event, (event) => event.customerId)
  events: Event[];
}

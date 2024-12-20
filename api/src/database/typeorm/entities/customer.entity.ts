import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AuthProviders from '../../../modules/shared/enums/auth-providers.enum';
import { Event } from './event.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, unique: true })
  document: string | null;

  @Column({ nullable: true, default: null })
  birth_date: Date | null;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  password: string | null;

  @Column({ default: null })
  picture_url: string | null;

  @Column({ nullable: false, type: 'enum', enum: AuthProviders })
  auth_provider: AuthProviders;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Event, (event) => event.customer)
  events: Event[];
}

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

  @Column({ unique: true })
  document: string;

  @Column()
  birth_date: Date;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  password: string;

  @Column({ default: null })
  picture_url: string | null;

  @Column({ default: 'local' })
  auth_provider: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Event, (event) => event.customerId)
  events: Event[];
}

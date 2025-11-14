import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/common/base.entity';

export abstract class TypeOrmBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  constructor(id?: string, createdAt?: Date) {
    super(id, createdAt);
  }
}

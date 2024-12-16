import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Logout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  token: string;
}

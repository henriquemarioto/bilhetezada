import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Timezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}

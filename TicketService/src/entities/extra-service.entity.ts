import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ExtraService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
}

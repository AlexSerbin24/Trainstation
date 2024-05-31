import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column()
  date: Date;

  @Column()
  templateName: string;

  @Column({ type: 'jsonb' })
  context: any;

  @Column({ default: false })
  isSent: boolean;
}

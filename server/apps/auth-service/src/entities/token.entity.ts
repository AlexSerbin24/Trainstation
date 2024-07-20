// token.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:"userId",nullable:false})
  userId: number;

  @JoinColumn({name:"userId"})
  @OneToOne(() => User, user => user.token, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  refreshToken: string;
}

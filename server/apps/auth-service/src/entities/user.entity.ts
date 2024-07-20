// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Role } from './role.entity';
import { Token } from './token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({name:"roleId",default:2}) //1 is admin, 2 is default user
  roleId: number;

  @Column(({name:"tokenId", nullable:true}))
  tokenId:number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  patronymic: string;

  @Column()
  email: string;

  @Column({nullable:true})
  passwordHash?: string;

  @JoinColumn({name:"roleId"})
  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @JoinColumn({name:"tokenId"})
  @OneToOne(() => Token, token => token.user,{nullable:true})
  token: Token;
}

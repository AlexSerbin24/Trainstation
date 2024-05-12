import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { ExtraService } from './extra-service.entity';

export enum TicketStatus {
    BOUGHT = 'bought',
    CANCELLED = 'cancelled', 
  }

  

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name:string

  @Column()
  lastname:string;

  @Column()
  patronymic:string;

  @Column()
  placeId: number;

  @Column()
  carriageNumber:number

  @Column()
  totalPrice: number;


  @Column()
  userId:number;

  @Column({ default: TicketStatus.BOUGHT })
  status: TicketStatus;

  @ManyToMany(() => ExtraService)
  @JoinTable()
  extraServices: ExtraService[];
  
}
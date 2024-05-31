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
  name: string

  @Column()
  lastname: string;

  @Column()
  patronymic: string;

  @Column()
  trainId: number;
  @Column()
  trainNumber:number
  @Column()
  departurePoint: string;

  @Column()
  arrivalPoint: string;
  @Column()
  departureDate: Date;
  @Column()
  arrivalDate: Date;

  @Column()
  placeId: number;
  @Column()
  placeNumber:number;

  @Column()
  carriageNumber: number

  @Column({type:"float"})
  totalPrice: number;


  @Column()
  userId: number;

  @Column({ default: TicketStatus.BOUGHT })
  status: TicketStatus;

  @ManyToMany(() => ExtraService)
  @JoinTable()
  extraServices: ExtraService[];

}
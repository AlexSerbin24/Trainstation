import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { ExtraService } from './extra-service.entity';
import { Discount } from './discount.entity';


export enum TicketStatus {
    BOOKED = 'booked',
    BOUGHT = 'bought',
    CANCELLED = 'cancelled', 
  }

  

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  placeId: number;

  @Column()
  userId:number;

  @Column({ default: TicketStatus.BOOKED })
  status: TicketStatus;

  @Column()
  price: number;

  @ManyToMany(() => ExtraService)
  @JoinTable()
  extraServices: ExtraService[];

  @ManyToMany(() => Discount)
  @JoinTable()
  discounts: Discount[];
}
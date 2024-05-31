import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carriage } from './carriage.entity';

@Entity()
export class CarriagePlace {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: number;

    @Column()
    isOccupied: boolean;

    @Column({ name: "carriageId" })
    carriageId:number;

    @ManyToOne(() => Carriage, carriage => carriage.carriagePlaces, { onDelete: "CASCADE" })
    @JoinColumn({ name: "carriageId" })
    carriage: Carriage;
}

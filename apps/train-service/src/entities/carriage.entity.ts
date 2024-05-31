import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CarriagePlace } from './carriagePlace.entity';
import { Train } from './train.entity';

export enum CarriageType {
    COUPE = "Coupe",
    LUX = "LUX",
    RESERVED_SEAT = "Reserved_seat",
    INTERCITY = "Intercity",
    INTERCITY_HEAD = "Intercity_head"
}

@Entity()
export class Carriage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: CarriageType,
        default: CarriageType.RESERVED_SEAT
    })
    carriageType: CarriageType;

    @Column()
    carriageNumber: number;

    @Column({ name: "trainId" })
    trainId: number;

    @OneToMany(() => CarriagePlace, carriagePlace => carriagePlace.carriage)
    carriagePlaces: CarriagePlace[];

    @ManyToOne(() => Train, train => train.trainUnits, { onDelete: "CASCADE" })
    @JoinColumn({ name: "trainId" })
    train: Train;
}

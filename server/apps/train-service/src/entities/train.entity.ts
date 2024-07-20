import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { RouteSegment } from './routeSegment.entity';
import { Carriage } from './carriage.entity';


export enum TrainStatus {
    AwaitingDeparture = 'Awaiting departure',
    Cancelled = 'Cancelled',
    OnTheWay = 'On the way',
    Arrived = 'Arrived'
}


export enum TrainType {
    Intercity = 'Intercity',
    Common = 'Common'
}


@Entity()
export class Train {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    trainNumber: number;

    @Column({
        type: 'enum',
        enum: TrainStatus,
        default: TrainStatus.AwaitingDeparture
    })
    trainStatus: TrainStatus;

    @Column({
        type: 'enum',
        enum: TrainType,
        default: TrainType.Common
    })
    trainType: TrainType;

    @OneToMany(() => RouteSegment, routeSegment => routeSegment.train)
    routeSegments: RouteSegment[];

    @OneToMany(() => Carriage, trainUnit => trainUnit.train)
    trainUnits: Carriage[];
}

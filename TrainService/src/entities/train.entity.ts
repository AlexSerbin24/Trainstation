import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { RouteSegment } from './routeSegment.entity';
import { Carriage } from './carriage.entity';
import { ObjectType, Field } from '@nestjs/graphql';


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


@ObjectType()
@Entity()
export class Train {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    trainNumber: number;

    @Field()
    @Column({
        type: 'enum',
        enum: TrainStatus,
        default: TrainStatus.AwaitingDeparture
    })
    trainStatus: TrainStatus;

    @Field()
    @Column({
        type: 'enum',
        enum: TrainType,
        default: TrainType.Common
    })
    trainType: TrainType;

    @Field(()=>[RouteSegment],{nullable:true})
    @OneToMany(() => RouteSegment, routeSegment => routeSegment.train)
    routeSegments: RouteSegment[];

    @Field(()=>[Carriage],{nullable:true})
    @OneToMany(() => Carriage, trainUnit => trainUnit.train)
    trainUnits: Carriage[];
}
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Train } from './train.entity';
import { Station } from './station.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RouteSegment {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({name:"trainId"})
    trainId: number;

    @Field(()=>Train)
    @JoinColumn({name:"trainId"})
    @ManyToOne(() => Train, train => train.routeSegments)
    train: Train;

    @Field()
    @Column({name:"stationId"})
    stationId: number;

    @Field(()=>Station)
    @JoinColumn({name:"stationId"})
    @ManyToOne(() => Station)
    station: Station;

    @Field()
    @Column({ type: 'timestamp', nullable:true })
    departureTime: Date | null;

    @Field()
    @Column({ type: 'timestamp', nullable:true })
    arrivalTime: Date | null;
}
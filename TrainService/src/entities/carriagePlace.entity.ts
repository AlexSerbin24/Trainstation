import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carriage } from './carriage.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CarriagePlace {
    @Field()
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    number: number;

    @Field()
    @Column()
    isOccupied: boolean

    @Field(()=>Carriage)
    @ManyToOne(() => Carriage, carriage=>carriage.carriagesPlaces,{onDelete:"CASCADE"})
    @JoinColumn({name:"carriageId"})
    carriage: Carriage
}

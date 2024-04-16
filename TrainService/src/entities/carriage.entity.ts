import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Train } from './train.entity';
import { CarriagePlace } from './carriagePlace.entity';


export enum CarriageType{
    COUPE = "Coupe",
    LUX = "LUX",
    RESERVED_SEAT = "Reserved seat",
    INTERCITY = "Intercity",
    INTERCITY_HEAD = "Intercity(head)"
}




@ObjectType()
@Entity()
export class Carriage {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({
        type: 'enum',
        enum: CarriageType,
        default: CarriageType.RESERVED_SEAT
    })
    carriageType: CarriageType;

    @Field()
    @Column()
    carriageNumber:number

    @Field()
    @Column({name:"trainId"})
    trainId:number;

    @Field(()=>[CarriagePlace],{nullable:true})
    @OneToMany(()=>CarriagePlace, carriagePlace=>carriagePlace.carriage)
    carriagesPlaces:CarriagePlace[];

    @Field(()=>Train)
    @ManyToOne(() => Train,  train => train.trainUnits, {onDelete:"CASCADE"})
    @JoinColumn({name:"trainId"})
    train: Train;
}

import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { TrainType } from '../entities/train.entity';
import { CarriageType } from 'src/entities/carriage.entity';

@InputType()
export class StationData{
  @Field()
  stationId: number;

  @Field({nullable:true})
  departureDate: Date | null;


  @Field({nullable:true})
  arrivalDate: Date | null
}

@InputType()
export class CreateCarriage  {

  
  @Field({nullable:true})
  id?: number;
  
  @Field()
  carriageType: CarriageType;

  
  @Field()
  carriageNumber: number
}

@InputType()
export class TrainCreateInput {
  @Field()
  trainNumber: number;

  @Field()
  trainType: TrainType;

  @Field(()=>[StationData])
  stations: StationData[];

  @Field(()=>[CreateCarriage])
  carriages: CreateCarriage[];
}
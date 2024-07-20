import { CarriagePlace } from "./train";

export default interface TrainInfo {
  id: number;
  carriagesTypes:string[],
  route:{
    departurePoint:string,
    departureTime:string,
    arrivalPoint:string,
    arrivalTime:string
  },
  trainNumber: number,
  trainType:string,
}


export interface CarriageInfo{
id:number,
type:string,
carriagePlaces:CarriagePlace[],
carriageNumber:number
}




export interface SelectedPlace{
  id:number,
  number:number,
  carriageType:string,
  carriageNumber:number
}

export interface TrainFullInfo extends TrainInfo{
  carriages: CarriageInfo[]
}
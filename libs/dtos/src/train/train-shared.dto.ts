import { CarriageType, TrainType } from "./train-entities.dto";


export interface StationData {
    stationId: number;
    departureDate: Date | null;
    arrivalDate: Date | null;
}

export interface CreateCarriage {
    id?: number;
    carriageType: string;
    carriageNumber: number;
}

export type TrainCreate = {
    trainNumber: number;
    trainType: string;
    stations: StationData[];
    carriages: CreateCarriage[];
}

export type TrainsSearch = {
    departureStation: string;

    arrivalStation: string;

    departureTime: Date;

    extraData:boolean
}


export type TrainUpdate = Pick<TrainCreate, 'stations' | 'carriages'>
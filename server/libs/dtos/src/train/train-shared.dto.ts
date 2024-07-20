import { CarriageType, TrainType } from "./train-entities.dto";


export interface StationData {
    stationId: number;
    departureDate: Date | null;
    arrivalDate: Date | null;
}

export interface CreateCarriage {
    id?: number;
    carriageType: CarriageType;
    carriageNumber: number;
}

export interface SearchedRoute {
    departurePoint: string;
    departureDate: Date;
    arrivalPoint: string;
    arrivalDate: Date;
}

export interface TrainDetails {
    id: number;
    trainNumber: number;
    trainType: string;
    route: SearchedRoute;
    carriagesTypes: {
        type: string;
        notOccupiedCount: number;
    }[]
}

export interface TrainDetailsWithCarriage extends TrainDetails {
    carriages: {
        id: number;
        type: CarriageType;
        carriagePlaces: {
            id: number;
            number: number;
            isOccupied: boolean;
        }[];
        carriageNumber: number;
    }[];
}

export type TrainCreate = {
    trainNumber: number;
    trainType: string;
    stations: StationData[];
    carriages: CreateCarriage[];
}

export type TrainsSearch = {
    departurePoint: string;

    arrivalPoint: string;

    departureDate: Date;

    isRoundTrip: boolean
}


export type TrainUpdate = Pick<TrainCreate, 'stations' | 'carriages'>




export type TrainDataForUpdate = {
    trainNumber: number;
    trainType: string;
    stations: StationData[],
    carriages: {
        id: number;
        carriageType: CarriageType;
        carriageNumber: number;
    }[]
}



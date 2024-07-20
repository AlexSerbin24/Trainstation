export interface StationData {
    stationId: number;
    departureDate: string | null;
    arrivalDate: string | null;
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
    departurePoint: string;

    arrivalPoint: string;

    departureDate: Date;

    extraData:boolean
}


export type TrainUpdate = Pick<TrainCreate, 'stations' | 'carriages'>




export type TrainDataForCreaionOrUpdate = {
    trainNumber: number;
    trainType: string;
    stations: StationData[],
    carriages: {
        id: number;
        carriageType: string;
        carriageNumber: number;
    }[]
}


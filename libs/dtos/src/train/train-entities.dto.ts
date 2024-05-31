export enum CarriageType {
    COUPE = "Coupe",
    LUX = "LUX",
    RESERVED_SEAT = "Reserved_seat",
    INTERCITY = "Intercity",
    INTERCITY_HEAD = "Intercity_head"
}

export class CarriageDto {
    id: number;
    carriageType: CarriageType;
    carriageNumber: number;
    trainId: number;
    carriagePlaces: CarriagePlaceDto[];
}

export class CarriagePlaceDto {
    id: number;
    number: number;
    isOccupied: boolean;
    carriageId: number;
}

export enum TrainType {
    Intercity = 'Intercity',
    Common = 'Common'
}


export enum TrainStatus {
    AwaitingDeparture = 'Awaiting departure',
    Cancelled = 'Cancelled',
    OnTheWay = 'On the way',
    Arrived = 'Arrived'
}

export class RouteSegmentDto {
    id: number;
    trainId: number;
    stationId: number;
    station: StationDto;
    departureTime: Date | null;
    arrivalTime: Date | null;
}

export class TrainDto {
    id: number;
    trainNumber: number;
    trainStatus: TrainStatus;
    trainType: TrainType;
    routeSegments: RouteSegmentDto[];
    trainUnits: CarriageDto[];
}

export class StationDto {
    id: number;
    name: string;
  }
  
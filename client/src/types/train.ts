
export interface Carriage{
    id: number;
    carriageType: string;
    carriageNumber: number;
    trainId: number;
    carriagePlaces: CarriagePlace[];
}

export interface CarriagePlace {
    id: number;
    number: number;
    isOccupied: boolean;
}

export interface RouteSegment {
    id: number;
    trainId: number;
    stationId: number;
    station: Station;
    departureTime: string | null;
    arrivalTime: string | null;
}

export default interface Train{
    id: number;
    trainNumber: number;
    trainStatus: string;
    trainType: string;
    routeSegments: RouteSegment[];
    trainUnits: Carriage[];
}

export interface Station {
    id: number;
    name: string;
  }
  
interface RouteSegmentForEmail{
    station:string,
    departureDate?:string,
    arrivalDate?:string
}

export interface NotificationContext {
    firstName: string,
    lastName: string,
}

export interface TrainContext extends NotificationContext {
    trainNumber: number,
}


export interface TrainUpdateContext extends TrainContext{
    routeSegments:RouteSegmentForEmail[]
}


export interface TrainRemindContext extends TrainContext{
    departure:string,
    departureDate:string,
    arrival:string,
    arrivalDate:string
}
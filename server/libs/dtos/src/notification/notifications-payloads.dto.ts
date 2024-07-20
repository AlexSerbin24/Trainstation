interface RouteSegment {
    station:string,
    departureDate?:Date,
    arrivalDate?:Date
}

interface UserData {
    email: string, 
    firstname: string, 
    lastname: string
}

interface TrainDataBase {
    trainNumber: number;
}

interface TrainDataBaseWithRoutes extends TrainDataBase {
    routeSegments: RouteSegment[];
}

interface TranDataForRemind extends TrainDataBase{
    departure:string,
    departureDate:Date,
    arrival:string,
    arrivalDate:Date
}

export type  UpdateTrainNotificationPayload = {
    users: UserData[],
    trainData: TrainDataBaseWithRoutes
}

export type  RemoveTrainNotificationPayload = {
    users:UserData[],
    trainData:TrainDataBase
}

export type RemindTrainNotificationPayload ={
    user:UserData,
    trainData:TranDataForRemind,
    date:Date
}
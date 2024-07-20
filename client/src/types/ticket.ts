import ExtraService from "./extraService";

export interface Ticket {
    trainId:number;
    trainNumber:number,
    name: string;
    lastname: string;
    patronymic: string;
    departurePoint:string,
    arrivalPoint:string,
    departureDate:Date,
    arrivalDate:Date,
    placeId: number;
    placeNumber:number,
    carriageNumber: number;
    totalPrice: number;
    email?:string;
    extraServices?: ExtraService[];
};
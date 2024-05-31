export interface TicketDataDto {
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
    extraServices?: ExtraServiceDto[];
};


export interface ExtraServiceDto{
    id:number,
    name: string;
    price: number;
}
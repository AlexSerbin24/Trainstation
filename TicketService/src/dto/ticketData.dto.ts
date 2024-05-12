export interface TicketDataDto {
    name: string;
    lastname: string;
    patronymic: string;
    placeId: number;
    carriageNumber: number;
    totalPrice: number;
    extraServices?: number[];
};

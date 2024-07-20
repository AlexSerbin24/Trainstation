import ExtraService from "./extraService";

export default interface PassengerData {
    name: string;
    lastname: string;
    patronymic: string;
    email?: string;
    extraServices: ExtraService[];
};
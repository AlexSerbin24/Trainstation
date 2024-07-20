import { Ticket } from "./ticket";

export default interface CartItem{
    key:string,
    ticket:Ticket,
    bookDate:Date
}
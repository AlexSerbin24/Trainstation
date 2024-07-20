import { Ticket } from "../types/ticket.ts";
import createAxiosInstance from "../api/authAxios.ts";
import CartItem from "../types/cartItem.ts";


export default class TicketService {
    private static authAxiosInstance = createAxiosInstance('http://localhost:3001/ticket');
    

    static async getTickets(userId:number){
        const response = await this.authAxiosInstance.get<Ticket[]>(`/history/${userId}`);
        return  response.data
    }

    static async buyTickets(userId:number, cart:CartItem[]){
        const response = await this.authAxiosInstance.post<boolean>("/buy",{userId, cart});
        return response.data;
    
    }

    static async cancelTicket(){

    }

    static async downloadTicket(ticketId: number) {
        const response = await this.authAxiosInstance.get(`/download/${ticketId}`, {
            responseType: 'blob' 
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ticket.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


}

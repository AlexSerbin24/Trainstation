import { Ticket } from "../types/ticket.ts";
import createAxiosInstance from "../api/authAxios.ts";
import CartItem from "../types/cartItem.ts";


export default class CartService {
    private static authAxiosInstance = createAxiosInstance('http://localhost:3001/ticket');
    

    static async getCart(userId:number){
       const response = await this.authAxiosInstance.get<CartItem>(`/get_cart/${userId}`);
       return response.data
    }

    static async addToCart(userId:number, ticket:Ticket[]){
        const response = await this.authAxiosInstance.post<CartItem[]>(`/add_to_cart/${userId}`,ticket);
        return response.data;
        
    }

    static async removeFromCart(ticketKey:string){
        const response = await this.authAxiosInstance.delete<boolean>(`/remove_from_cart/${ticketKey}`);
        return response.data;
        
    }

    static async clearCart(ticketKeys: string[]){
        const response = await this.authAxiosInstance.post<boolean>("/clear_cart",{ticketKeys, changePlaceStatus:true});
        return response.data
    }


}

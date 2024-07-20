import createAxiosInstance from "../api/authAxios.ts";
import { ChatMessage } from "../types/chatMessage";


export default class ChatService {

    private static chatAxios = createAxiosInstance('http://localhost:3001/chat');

    

    static async sendMessage(message: string, userId: number = 1) {



        const prevMessagesString = sessionStorage.getItem("chat_messages");

        const prevMessages = prevMessagesString ? JSON.parse(prevMessagesString) as ChatMessage[] : [];

        const response = await this.chatAxios.post<ChatMessage>("/",{ message, userId, prevMessages });

        prevMessages.push(response.data);

        sessionStorage.setItem("chat_messages", JSON.stringify(prevMessages));
        return response.data;

    }

    static async getMessageLimitStatus(userId:number){}


}


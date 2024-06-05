import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { GATEWAY_CHAT_SERVICE } from '../constants/services.constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ChatMessageData } from '@app/dtos';
import { AuthGuard } from '@nestjs/passport';
import { SEND_MESSAGE_TO_CHAT } from '@app/messages';


@Controller("chat")
@UseGuards(AuthGuard(["jwt"]))
export class ChatServiceController {
    constructor(
        @Inject(GATEWAY_CHAT_SERVICE)
        private readonly gatewayChatProxy: ClientProxy) {

    }

    @Post()
    async sendMessageToChat(@Body() messageData:ChatMessageData){
        return await lastValueFrom(this.gatewayChatProxy.send({cmd: SEND_MESSAGE_TO_CHAT}, messageData));

    }
}
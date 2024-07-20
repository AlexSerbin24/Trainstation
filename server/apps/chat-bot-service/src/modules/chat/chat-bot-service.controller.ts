import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ChatBotServiceService } from './chat-bot-service.service';
import { ChatMessageData } from '@app/dtos';
import { SEND_MESSAGE_TO_CHAT } from '@app/messages';
import { handleRpcError } from '@app/utils';

@Controller()
export class ChatBotServiceController {
  constructor(private readonly chatBotServiceService: ChatBotServiceService) { }

  @MessagePattern({ cmd: SEND_MESSAGE_TO_CHAT })
  async sendMessageToChat(data: ChatMessageData) {
    try {
      return await this.chatBotServiceService.sendMessageToChat(data.message, data.prevMessages, data.userId);
    } catch (error) {
      handleRpcError(error);
    }
  }

}

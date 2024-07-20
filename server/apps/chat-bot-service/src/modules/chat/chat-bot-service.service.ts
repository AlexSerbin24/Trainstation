import { FIND_TRAINS_BY_ROUTE_AND_DATE } from '@app/messages';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import OpenAI from 'openai';
import { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources';
import { lastValueFrom } from 'rxjs';
import { CHAT_TRAIN_SERVICE, MESSAGES_REDIS_SERVICE } from '../../constants/service.constants';
import { MessagesRedisService } from '../messages/messagesRedis.service';

@Injectable()
export class ChatBotServiceService {


  private openai: OpenAI;
  private readonly systemMessages: ChatCompletionMessageParam[] = [];

  private readonly tools: ChatCompletionTool[] = [{
    type: "function",
    function: {
      name: "getTrains",
      description: "Отримати рейсы для рекомендації",
      parameters: {
        type: "object",
        properties: {
          departurePoint: {
            "type": "string",
            "description": "Місто відправлення. Завжди переводити назву українською"
          },
          arrivalPoint: {
            "type": "string",
            "description": "Місто прибуття. Завжди переводити назву українською"
          },
          departureDate: {
            "type": "string",
            "description": `Дата відправлення у форматі YYYY-MM-DD. Час: 00:00, рік: ${new Date().getFullYear()} `,
            "format": "date"
          },
          isRoundTrip:{
            "type":"boolean",
            "description":"Чи шукає користувач зворотній рейс. true якщо користувач просить, в інших випадках false"
          }
        },
        required: ["departurePoint", "arrivalPoint", "departureDate",'isRoundTrip']
      }
    }
  },

  ]
  constructor(
    private readonly configService: ConfigService,
    @Inject(CHAT_TRAIN_SERVICE) private readonly chatTrainProxy: ClientProxy,
    @Inject(MESSAGES_REDIS_SERVICE) private messagesRedisService: MessagesRedisService
  ) {
    const apiKey = this.configService.get<string>("API_KEY");


    //System messages
    const welcomeMessage = this.configService.get<string>("SYSTEM_WELCOME_MESSAGE");
    const recommendationRulesMessage = this.configService.get<string>("SYSTEM_RECOMMENDATION_RULES");
    const desiredTrainsRulesMessage = this.configService.get<string>("SYSTEM_DESIRED_TRAINS_RULES");
    const finalResponseFormatMessage = this.configService.get<string>("SYSTEM_FINAL_RESPONSE_FORMAT");
    const languageMessage = this.configService.get<string>("SYSTEM_LANGUAGE");

    this.systemMessages.push(
      { content: welcomeMessage, role: "system" },
      { content: recommendationRulesMessage, role: "system" },
      { content: desiredTrainsRulesMessage, role: "system" },
      { content: finalResponseFormatMessage, role: "system" },
      { content: languageMessage, role: "system" }
    )


    //Tools


    this.openai = new OpenAI({
      apiKey,
    })

  }
  async sendMessageToChat(message: string, prevMessages: ChatCompletionMessageParam[], userId: number) {
    const messages: ChatCompletionMessageParam[] = [...this.systemMessages, ...prevMessages, { content: message, role: "user" }];

    const allowToSendMsg = true; await this.messagesRedisService.increaseMessageCounter(userId);

    if (allowToSendMsg) {

      const response = await this.openai.chat.completions.create({
        messages,
        model: 'gpt-4-0125-preview',
        tools: this.tools,
        tool_choice: "auto",
        temperature: 0
      });

      const responseMessage = response.choices[0].message
      const toolCalls = responseMessage.tool_calls;

      if (toolCalls && toolCalls.length) {
        for (const toolCall of toolCalls) {

          const functionName = toolCall.function.name;


          const functioArgs = JSON.parse(toolCall.function.arguments);

          let functionResponse: any;


          switch (functionName) {
            case "getTrains":
              functionResponse = await this.getTrains(functioArgs.departurePoint, functioArgs.arrivalPoint, functioArgs.departureDate, functioArgs.isRoundTrip);
              break;
          }

          messages.push({
            role: 'assistant',
            name: functionName,
            content: JSON.stringify(functionResponse)
          });
        }
      }

      const secondResponse = await this.openai.chat.completions.create({
        model: 'gpt-4-0125-preview',
        messages,
        temperature: 0
      })
      return secondResponse.choices[0].message;
    }
    else{
      throw new Error("Meessages are not allowd because it exceeds limit");
    }

  }


  private async getTrains(departurePoint: string, arrivalPoint: string, departureDate: Date, isRoundTrip:boolean) {
    return await lastValueFrom(this.chatTrainProxy.send({ cmd: FIND_TRAINS_BY_ROUTE_AND_DATE }, { departurePoint, arrivalPoint, departureDate, isRoundTrip}));

  }
}

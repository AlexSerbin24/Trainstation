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
          departureStation: {
            "type": "string",
            "description": "Місто відправлення. Завжди переводити назву українською"
          },
          arrivalStation: {
            "type": "string",
            "description": "Місто прибуття. Завжди переводити назву українською"
          },
          departureDate: {
            "type": "string",
            "description": `Дата відправлення у форматі YYYY-MM-DD. Час: 00:00, рік: ${new Date().getFullYear()} `,
            "format": "date"
          }
        },
        required: ["departurePoint", "arrivalPoint", "departureDate"]
      }
    }
  },
    // {
    //   type: "function",
    //   function: {
    //     name: "getEarlyUserTickets",
    //     description: "Отримати ранні рейси користувача для кращого розуміння який рейс йому запропонувати",
    //   }
    // }]
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

    const allowToSendMsg = await this.messagesRedisService.increaseMessageCounter(userId);

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
          console.log(functioArgs)

          let functionResponse: any;


          switch (functionName) {
            case "getTrains":
              functionResponse = await this.getTrains(functioArgs.departureStation, functioArgs.arrivalStation, functioArgs.departureDate);
              break;
          }

          messages.push({
            // tool_call_id: callId,
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
      return secondResponse
    }
    else{
      throw new Error("Meessages are not allowd because it exceeds limit");
    }

  }


  private async getTrains(departureStation: string, arrivalStation: string, departureTime: Date) {
    return await lastValueFrom(this.chatTrainProxy.send({ cmd: FIND_TRAINS_BY_ROUTE_AND_DATE }, { departureStation, arrivalStation, departureTime: new Date(departureTime), extraData: true }));

  }
}

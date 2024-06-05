import { Module } from '@nestjs/common';
import { ChatBotServiceController } from './modules/chat/chat-bot-service.controller';
import { ChatBotServiceService } from './modules/chat/chat-bot-service.service';
import { RmqModule } from '@app/rmq';
import { CHAT_TRAIN_SERVICE, MESSAGES_REDIS_SERVICE } from './constants/service.constants';
import { CHAT_TRAIN_QUEUE } from '@app/queries';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MessagesRedisService } from './modules/messages/messagesRedis.service';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '.env'),
    }),
    RmqModule.register([
      { name: CHAT_TRAIN_SERVICE, queue: CHAT_TRAIN_QUEUE }
    ]),
    RedisModule.forRoot([{ name: MESSAGES_REDIS_SERVICE, useClass: MessagesRedisService }])
  ],
  controllers: [ChatBotServiceController],
  providers: [ChatBotServiceService],
})
export class AppModule { }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/rmq';
import { GATEWAY_CHAT_QUEUE } from '@app/queries';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const rmqUrl = configService.get<string>('RABBITMQ_URL');

  app.connectMicroservice(RmqService.getOptions([rmqUrl], GATEWAY_CHAT_QUEUE, true));


  app.startAllMicroservices();
  console.log("ChatService is listening")
}
bootstrap();

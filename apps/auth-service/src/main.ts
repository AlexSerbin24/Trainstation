import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/rmq';
import { GATEWAY_AUTH_QUEUE, TRAIN_AUTH_QUEUE } from 'libs/queues/src';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rmqUrl =  configService.get<string>('RABBITMQ_URL');

  app.connectMicroservice(RmqService.getOptions([rmqUrl],TRAIN_AUTH_QUEUE,true));
  app.connectMicroservice(RmqService.getOptions([rmqUrl],GATEWAY_AUTH_QUEUE,true))
  
  app.startAllMicroservices();
  console.log('AuthService is listening');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/rmq';
import { GATEWAY_TICKET_QUEUE, TRAIN_TICKET_QUEUE } from 'libs/queues/src';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rmqUrl = configService.get<string>('RABBITMQ_URL');

  app.connectMicroservice(RmqService.getOptions([rmqUrl], TRAIN_TICKET_QUEUE, true));
  app.connectMicroservice(RmqService.getOptions([rmqUrl],GATEWAY_TICKET_QUEUE,true))

  app.startAllMicroservices();
  console.log('TicketService is listening');
}
bootstrap();

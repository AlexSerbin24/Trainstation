// apps/notification-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from '@app/rmq';
import { ConfigService } from '@nestjs/config';
import { GATEWAY_NOTIFICATION_QUEUE, TICKET_NOTIFICATION_QUEUE, TRAIN_NOTIFICATION_QUEUE } from '@app/queries/index';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rmqUrl = configService.get<string>('RABBITMQ_URL');

  app.connectMicroservice(RmqService.getOptions([rmqUrl],TRAIN_NOTIFICATION_QUEUE,true));
  app.connectMicroservice(RmqService.getOptions([rmqUrl],TICKET_NOTIFICATION_QUEUE,true));
  app.connectMicroservice(RmqService.getOptions([rmqUrl], GATEWAY_NOTIFICATION_QUEUE, true));
  app.startAllMicroservices();
  console.log('NotificationService is listening');
}

bootstrap();
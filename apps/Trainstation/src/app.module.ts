// Модуль app.module.ts

import { Module } from '@nestjs/common';
import { TrainServiceController } from './controllers/train-service.controller';
import { AuthServiceController } from './controllers/auth-service.controller';
import { TicketServiceController } from './controllers/ticket-service.controller';
import { RmqModule } from '@app/rmq';
import { GATEWAY_AUTH_SERVICE, GATEWAY_NOTIFICATION_SERVICE, GATEWAY_TICKET_SERVICE, GATEWAY_TRAIN_SERVICE } from './constants/services.constants';
import { GATEWAY_AUTH_QUEUE, GATEWAY_NOTIFICATION_QUEUE, GATEWAY_TICKET_QUEUE, GATEWAY_TRAIN_QUEUE } from '@app/queries';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmailtServiceController } from './controllers/email-service.controller';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [RmqModule.register([
    { name: GATEWAY_TICKET_SERVICE, queue: GATEWAY_TICKET_QUEUE },
    { name: GATEWAY_TRAIN_SERVICE, queue: GATEWAY_TRAIN_QUEUE },
    { name: GATEWAY_AUTH_SERVICE, queue: GATEWAY_AUTH_QUEUE },
    { name: GATEWAY_NOTIFICATION_SERVICE, queue: GATEWAY_NOTIFICATION_QUEUE }]),
  ScheduleModule.forRoot(),],
  controllers: [TrainServiceController, AuthServiceController, TicketServiceController, EmailtServiceController],
  providers: [JwtStrategy]
})
export class AppModule { }

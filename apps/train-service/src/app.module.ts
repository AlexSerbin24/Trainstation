import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrainModule } from './modules/train/train.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '@app/rmq';
import { Carriage } from './entities/carriage.entity';
import { CarriagePlace } from './entities/carriagePlace.entity';
import { Train } from './entities/train.entity';
import { Station } from './entities/station.entity';
import { RouteSegment } from './entities/routeSegment.entity';
import { join } from 'path';
import { TRAIN_AUTH_SERVICE, TRAIN_NOTIFICATION_SERVICE, TRAIN_TICKET_SERVICE } from './constants/service.constants';
import { TRAIN_AUTH_QUEUE, TRAIN_NOTIFICATION_QUEUE, TRAIN_TICKET_QUEUE } from '@app/queries/index';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '.env'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Carriage, CarriagePlace, Train, Station, RouteSegment],
      synchronize: true,
    }),
    RmqModule.register([
      { name: TRAIN_NOTIFICATION_SERVICE, queue: TRAIN_NOTIFICATION_QUEUE },
      { name: TRAIN_TICKET_SERVICE, queue: TRAIN_TICKET_QUEUE },
      { name: TRAIN_AUTH_SERVICE, queue: TRAIN_AUTH_QUEUE }]),

    TrainModule,



  ],
})
export class AppModule {
}
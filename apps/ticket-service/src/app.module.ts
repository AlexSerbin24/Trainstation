import { Module } from '@nestjs/common';
import { CartModule } from './modules/cart/cart.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { CartRedisService } from './modules/redis/cartRedis.service';
import { RedisModule } from '@app/redis';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CART_REDIS_SERVICE, TICKET_NOTIFICATION_SERVICE, TICKET_TRAIN_SERVICE } from './constants/services.constants';
import { RmqModule } from "@app/rmq"
import { Ticket } from './entities/ticket.entity';
import { ExtraService } from './entities/extra-service.entity';
import { TICKET_NOTIFICATION_QUEUE, TICKET_TRAIN_QUEUE } from 'libs/queues/src';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: join(__dirname, '.env'), isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Ticket, ExtraService],
      synchronize: true,
    }),

    RmqModule.register([
      { name: TICKET_TRAIN_SERVICE, queue: TICKET_TRAIN_QUEUE}, 
      {name:TICKET_NOTIFICATION_SERVICE, queue:TICKET_NOTIFICATION_QUEUE}]),
    RedisModule.forRoot([{ name: CART_REDIS_SERVICE, useClass: CartRedisService }]),
    CartModule,
    TicketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

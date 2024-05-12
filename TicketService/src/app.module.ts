import { Module } from '@nestjs/common';
import { CartModule } from './modules/cart/cart.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { RmqModule } from 'trainstation-rabbitmq-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { CartRedisService } from './modules/redis/cartRedis.service';
import { RedisModule } from './modules/redis/redis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CART_REDIS_SERVICE, TRAIN_RMQ_SERVICE } from './constants/services.constants';
import { TICKET_TO_TRAINS_QUEUE } from './constants/queues.constants';


RmqModule.register({ name: 'TRAIN_RMQ_SERVICE', queue: 'TICKET_TO_TRAINS' })
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal:true }),
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
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),

    RmqModule.register({ name: TRAIN_RMQ_SERVICE, queue: TICKET_TO_TRAINS_QUEUE }),
    RedisModule.forRoot([{ name: CART_REDIS_SERVICE, useClass: CartRedisService }]),
    CartModule,
    TicketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

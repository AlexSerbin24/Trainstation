
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './modules/email/email.module';
// import { RmqModule } from "../../libs/rmq/src";
import { ServeStaticModule } from '@nestjs/serve-static';
import path, { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';



@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
      isGlobal: true,
      envFilePath: join(__dirname, '.env')
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Task],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static/templates'),
      serveRoot: '/templates',
    }),
    EmailModule,

  ],
  providers: [],
})
export class AppModule { }
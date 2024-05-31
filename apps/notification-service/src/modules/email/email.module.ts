import { Module, forwardRef } from '@nestjs/common';
import {EmailService} from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ConfigModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService], 
})
export class EmailModule { }

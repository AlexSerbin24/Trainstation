import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraService } from '../../entities/extra-service.entity';
import { Ticket } from '../../entities/ticket.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports:[TypeOrmModule.forFeature([Ticket,ExtraService]), CartModule],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {}

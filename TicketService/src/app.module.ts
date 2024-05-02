import { Module } from '@nestjs/common';
import { CartModule } from './modules/cart/cart.module';
import { TicketModule } from './modules/ticket/ticket.module';

@Module({
  imports: [CartModule, TicketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

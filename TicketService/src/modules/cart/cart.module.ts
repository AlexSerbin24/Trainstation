import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [],
  providers: [CartService,],
  controllers: [CartController]
})
export class CartModule { }

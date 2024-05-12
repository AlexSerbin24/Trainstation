import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { TicketDataDto } from 'src/dto/ticketData.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getUserCart(@Param('userId') userId: number) {
    return await this.cartService.getUserCart(userId);
  }

  @Post(':userId/add')
  async addToCart(@Param('userId') userId: number, @Body() ticketData: TicketDataDto[]) {
    return await this.cartService.addToCart(userId, ticketData);
  }

  @Delete(':ticketKey/remove')
  async removeFromCart(@Param('ticketKey') ticketKey: string) {
    return await this.cartService.removeFromCart(ticketKey);
  }

  @Post('clear')
  async clearCart(@Body() cartData: { ticketKeys: string[], changePlaceStatus: boolean }) {
    const { ticketKeys, changePlaceStatus } = cartData;
    return await this.cartService.clearCart(ticketKeys, changePlaceStatus);
  }
}

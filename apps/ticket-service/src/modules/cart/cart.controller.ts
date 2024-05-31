import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { TicketDataDto } from '@app/dtos';
import { GET_USER_CART, ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from '@app/messages';


@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: GET_USER_CART })
  async getUserCart(@Payload() userId: number) {
    return await this.cartService.getUserCart(userId);
  }

  @MessagePattern({ cmd: ADD_TO_CART })
  async addToCart(@Payload() data: { userId: number, ticketData: TicketDataDto[] }) {
    const { userId, ticketData } = data;
    return await this.cartService.addToCart(userId, ticketData);
  }

  @MessagePattern({ cmd: REMOVE_FROM_CART })
  async removeFromCart(@Payload() ticketKey: string) {
    return await this.cartService.removeFromCart(ticketKey);
  }

  @MessagePattern({ cmd: CLEAR_CART })
  async clearCart(@Payload() cartData: { ticketKeys: string[], changePlaceStatus: boolean }) {
    const { ticketKeys, changePlaceStatus } = cartData;
    return await this.cartService.clearCart(ticketKeys, changePlaceStatus);
  }
}

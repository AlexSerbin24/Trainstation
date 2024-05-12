import { Inject, Injectable } from '@nestjs/common';
import { CartRedisService } from '../redis/cartRedis.service';
import { TicketDataDto } from '../../dto/ticketData.dto';
import { CART_REDIS_SERVICE } from '../../constants/services.constants';

@Injectable()
export class CartService {

  constructor(@Inject(CART_REDIS_SERVICE) private cartRedisService: CartRedisService) {
  }

  async getUserCart(userId: number) {
    return await this.cartRedisService.getTickets(userId);
  }

  async addToCart(userId: number, ticketData: TicketDataDto[]) {
    return await this.cartRedisService.setTickets(userId, ticketData)
  }

  async removeFromCart(ticketKey: string) {
    await this.cartRedisService.deleteTicket(ticketKey);
    return true;
  }

  async clearCart(ticketKeys: string[], changePlaceStatus: boolean) {
    for (const key of ticketKeys) {
      await this.cartRedisService.deleteTicket(key, changePlaceStatus);
    }
    return true;
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketService } from './ticket.service';
import { CartItemDto, TicketDataDto } from '@app/dtos';
import { BUY_TICKET, CANCEL_TICKET, GET_TICKETS_HISTORY, DOWNLOAD_TICKET, GET_TRAIN_TICKETS_OWNERS } from '@app/messages';
import { CartService } from '../cart/cart.service';
import { handleRpcError } from '@app/utils';

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketService, private readonly cartService: CartService) { }

  @MessagePattern({ cmd: BUY_TICKET })
  async buyTicket(@Payload() data: { userId: number, cart: CartItemDto[] }): Promise<boolean> {
    try {
      const { userId, cart } = data;

      const keys: string[] = [];
      const ticketsData: TicketDataDto[] = [];
      for (const cartItem of cart) {
        keys.push(cartItem.key);
        ticketsData.push(cartItem.ticket)
      }

      await this.cartService.clearCart(keys, false);
      return await this.ticketService.buyTicket(userId, ticketsData);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: CANCEL_TICKET })
  async cancelTicket(@Payload() ticketId: number): Promise<boolean> {
    try {
      return await this.ticketService.cancelTicket(ticketId);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: GET_TICKETS_HISTORY })
  async getTicketsHistory(@Payload() userId: number): Promise<TicketDataDto[]> {
    try {
      return await this.ticketService.getTicketsHistory(userId);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: DOWNLOAD_TICKET })
  async downloadTicket(@Payload() ticketId: number): Promise<Buffer> {
    try {
      const data = await this.ticketService.downloadTicket(ticketId);
      return data
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: GET_TRAIN_TICKETS_OWNERS })
  async getTrainTicketsOwners(@Payload() trainId: number) {
    try {
      return await this.ticketService.getTrainTicketsOwners(trainId);
    } catch (error) {
      handleRpcError(error);
    }
  }
}

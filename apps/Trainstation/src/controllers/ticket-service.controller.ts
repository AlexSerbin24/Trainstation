import { Controller, Get, Post, Delete, Param, Body, Inject, UseGuards, Res } from '@nestjs/common';
import { TicketDataDto, CartItemDto } from '@app/dtos';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ADD_TO_CART, BUY_TICKET, CANCEL_TICKET, CLEAR_CART, DOWNLOAD_TICKET, GET_TICKETS_HISTORY, GET_USER_CART, REMOVE_FROM_CART } from '@app/messages';
import { GATEWAY_TICKET_SERVICE } from '../constants/services.constants';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('ticket')
@UseGuards(AuthGuard(["jwt"]))
export class TicketServiceController {
    constructor(
        @Inject(GATEWAY_TICKET_SERVICE)
        private readonly gatewayTicketProxy: ClientProxy,
    ) { }

    @Post('/buy')
    async buyTicket(@Body() data: { userId: number, cart: CartItemDto[] }): Promise<boolean> {
        return await lastValueFrom(this.gatewayTicketProxy.send<boolean>({ cmd: BUY_TICKET }, data));
    }

    @Delete('/cancel/:ticketId')
    async cancelTicket(@Param('ticketId') ticketId: number): Promise<boolean> {
        return await lastValueFrom(this.gatewayTicketProxy.send<boolean>({ cmd: CANCEL_TICKET }, ticketId));
    }

    @Get('/history/:userId')
    async getTicketsHistory(@Param('userId') userId: number): Promise<TicketDataDto[]> {
        return await lastValueFrom(this.gatewayTicketProxy.send<TicketDataDto[]>({ cmd: GET_TICKETS_HISTORY }, userId));
    }

    @Get('/download/:ticketId')
    async downloadTicket(@Param('ticketId') ticketId: number, @Res() res: Response){
        const result = await lastValueFrom(this.gatewayTicketProxy.send<{data:number[], type:string}>({ cmd: DOWNLOAD_TICKET }, ticketId));

        const buffer = Buffer.from(result.data)

        // Установка заголовков для ответа
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="Suka.pdf"',
            'Content-Length': buffer.length,
        });

        // Отправка файла в ответе
        
        res.send(buffer);
    }

    @Get('/get_cart/:userId')
    async getUserCart(@Param('userId') userId: number) {
        return await lastValueFrom(this.gatewayTicketProxy.send<CartItemDto[]>({ cmd: GET_USER_CART }, userId))
    }

    @Post('/add_to_cart/:userId')
    async addToCart(@Param('userId') userId: number, @Body() ticketData: TicketDataDto[]) {
        return await lastValueFrom(this.gatewayTicketProxy.send<CartItemDto[]>({ cmd: ADD_TO_CART }, { userId, ticketData }));
    }

    @Delete("/remove_from_cart/:ticketKey")
    async removeFromCart(@Param("ticketKey") ticketKey: string) {
        return await lastValueFrom(this.gatewayTicketProxy.send<boolean>({ cmd: REMOVE_FROM_CART }, ticketKey));
    }

    @Post('/clear_cart')
    async clearCart(@Body() cartData: { ticketKeys: string[], changePlaceStatus: boolean }) {
        return await lastValueFrom(this.gatewayTicketProxy.send<boolean>({ cmd: CLEAR_CART }, cartData));
    }

}

import { Controller, Post, Body, Delete, Param, Get, StreamableFile, Res  } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketDataDto } from '../../dto/ticketData.dto';
import { Ticket } from '../../entities/ticket.entity';
import { Response } from 'express';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('buy/:userId')
  async buyTicket(@Param('userId') userId: number, @Body() ticketsData: TicketDataDto[]): Promise<Ticket[]> {
    return await this.ticketService.buyTicket(userId, ticketsData);
  }

  @Delete('cancel/:ticketId')
  async cancelTicket(@Param('ticketId') ticketId: number): Promise<Ticket> {
    return await this.ticketService.cancelTicket(ticketId);
  }

  @Get('history/:userId')
  async getTicketsHistory(@Param('userId') userId: number): Promise<Ticket[]> {
    return await this.ticketService.getTicketsHistory(userId);
  }

  @Get('download/:ticketId')
  async downloadTicket(@Param('ticketId') ticketId: number, @Res() res: Response): Promise<void> {
    const ticketPdfBytes = await this.ticketService.downloadTicket(ticketId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket_${ticketId}.pdf`);
    res.send(ticketPdfBytes);
  }
}

import { Injectable } from '@nestjs/common';
import { Ticket } from '../../entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async buyTicket(ticketData: any): Promise<any> {
    // Реализация метода покупки билета
  }

  async cancelTicket(ticketId: string): Promise<void> {
    // Реализация метода отмены билета
  }

  async getTicketHistory(): Promise<Ticket[]> {
    return null;
  }

  async downloadTicket(ticketId: string): Promise<any> {
    // Реализация метода загрузки билета на устройство
  }
}
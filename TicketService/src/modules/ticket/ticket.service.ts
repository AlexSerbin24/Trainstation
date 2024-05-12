import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket, TicketStatus } from '../../entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraService } from '../../entities/extra-service.entity';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as fs from "fs"
import { join } from 'path';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'
import QRCode from 'qrcode'
import { TicketDataDto } from '../../dto/ticketData.dto';
import { TRAIN_RMQ_SERVICE } from 'src/constants/services.constants';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(ExtraService)
    private extraServicesRepository: Repository<ExtraService>,
    @Inject(TRAIN_RMQ_SERVICE)
    private trainClientProxy: ClientProxy
  ) { }

  async buyTicket(userId: number, ticketsData: TicketDataDto[]) {
    const tickets: Ticket[] = [];

    const extraServicesMap: { id: number, service: ExtraService }[] = [];

    for (const ticketData of ticketsData) {
      const ticket = new Ticket();

      ticket.userId = userId;
      ticket.name = ticketData.name;
      ticket.lastname = ticketData.lastname;
      ticket.patronymic = ticketData.patronymic;
      ticket.placeId = ticketData.placeId;
      ticket.carriageNumber = ticketData.carriageNumber;
      ticket.totalPrice = ticketData.totalPrice;

      for (const extraServiceId of ticketData.extraServices) {
        let extraService = null;

        if (extraServicesMap[extraServiceId]) {
          extraService = extraServicesMap[extraServiceId];
        }
        else {
          extraService = await this.extraServicesRepository.findOne({ where: { id: extraServiceId } });
          extraServicesMap[extraServiceId] = extraService;
        }

        ticket.extraServices.push(extraService);
      }

      tickets.push(ticket);
    }

    return await this.ticketRepository.save(tickets);
  }

  async cancelTicket(ticketId: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    ticket.status = TicketStatus.CANCELLED;
    return await this.ticketRepository.save(ticket)
  }

  async getTicketsHistory(userId: number): Promise<Ticket[]> {
    return await this.ticketRepository.find({ where: { userId } })
  }

  async downloadTicket(ticketId: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });

    if (!ticket) throw new NotFoundException();

    const trainData = await lastValueFrom<{ id: number, trainNumber: number, placeNumber: number, departure: string, arrival: string, departureDate: Date, arrivalDate: Date, extraServices: string[] }>(this.trainClientProxy.send({ cmd: "GET_TICKET_EXTRA_INFORMATION" }, { placeId: ticket.placeId, extraServices: ticket.extraServices }))

    const X_SPACING = 325;
    const ROW_SPACING_Y = 28;
    const START_ROW_Y = 710;
    const ROWS = 12;
    const FONT_SIZE = 16;
    const QR_X = 130;
    const QR_Y = 230
    const QR_WIDTH = 145;
    const QR_HEIGHT = 145;

    const ticketData = {
      name: ticket.name,
      lastname: ticket.lastname,
      patronymic: ticket.patronymic,
      trainNumber: trainData.trainNumber,
      carriageNumer: ticket.carriageNumber,
      placeNumber: trainData.placeNumber,
      departure: trainData.departure,
      arrival: trainData.arrival,
      departureDate: trainData.departureDate,
      arrivalDate: trainData.arrivalDate,
      extraServices: trainData.extraServices,
      price: ticket.totalPrice
    }

    const PROPS = ["name", "lastname", "patronymic", "trainNumber", "carriageNumber", "placeNumber", "departure", "arrival", "departureDate", "arrivalDate", "extraServices", "price"];


    const pdfBytes = await fs.promises.readFile(join(__dirname, '..', 'static', 'files', 'ticket_template.pdf'));
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const page = pdfDoc.getPage(0);


    pdfDoc.registerFontkit(fontkit)
    const fontBytes = await fs.promises.readFile(join(__dirname, '..', 'static', 'fonts', 'arial.ttf'));

    const font = await pdfDoc.embedFont(fontBytes);

    function getTrainFormattedDate(date: Date) {
      const day = date.getDate();
      const month = date.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }

    function getExtraServicesFormattedString(extraServices: string[]) {
      return extraServices.length ? extraServices.join(', ') : "There are no services";
    }

    for (let row = 0, currentRowY = START_ROW_Y; row < ROWS; row++, currentRowY -= ROW_SPACING_Y) {
      const propName = PROPS[row];

      switch (propName) {
        case 'departureDate':
        case 'arrivalDate':
          page.drawText(getTrainFormattedDate(trainData[propName]), { x: X_SPACING, y: currentRowY, font: font, size: FONT_SIZE });
          break;
        case 'extraServices':
          page.drawText(getExtraServicesFormattedString(ticketData[propName]), { x: X_SPACING, y: currentRowY, font: font, size: FONT_SIZE });
          break;
        default:
          page.drawText(ticketData[propName], { x: X_SPACING, y: currentRowY, font: font, size: FONT_SIZE });
          break;
      }

    }

    //QR CODE

    const qrData = `
    Flight: №${ticketData.trainNumber}
    Carriage: ${ticketData.carriageNumer}
    Place: ${ticketData.placeNumber}
    ${ticketData.lastname} ${ticket.name} ${ticket.patronymic}
    ${ticketData.departure}-${ticketData.arrival}
    ${getTrainFormattedDate(ticketData["departureDate"] as Date)} - ${getTrainFormattedDate(ticketData["arrivalDate"] as Date)}
    ${getExtraServicesFormattedString(ticketData["extraServices"])}    

    ${ticketData.price}
    `

    const qrCodeImage = await QRCode.toBuffer(qrData, { errorCorrectionLevel: 'H' });
    const qrImage = await pdfDoc.embedPng(qrCodeImage);

    page.drawImage(qrImage, {
      x: QR_X,
      y: QR_Y,
      width: QR_WIDTH,
      height: QR_HEIGHT,
    });


    const ticketPdfBytes = Buffer.from(await pdfDoc.save());

    return ticketPdfBytes;
  }
}


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
import * as fontkit from '@pdf-lib/fontkit'
import * as QRCode from 'qrcode'
import { TicketDataDto } from '@app/dtos';
import { TICKET_NOTIFICATION_SERVICE, TICKET_TRAIN_SERVICE } from '../../constants/services.constants';
import { ADD_REMIND_NOTIFICATION, UPDATE_PLACE_STATUS } from '@app/messages';


@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(ExtraService)
    private extraServicesRepository: Repository<ExtraService>,
    @Inject(TICKET_TRAIN_SERVICE)
    private ticketTrainProxy: ClientProxy,
    @Inject(TICKET_NOTIFICATION_SERVICE)
    private ticketNotificationProxy: ClientProxy,
  ) { }

  async buyTicket(userId: number, ticketsData: TicketDataDto[]) {
    const tickets: Ticket[] = [];

    const remindPayloads = []
    const extraServicesMap: { id: number, service: ExtraService }[] = [];

    for (const ticketData of ticketsData) {
      const ticket = new Ticket();
      ticket.userId = userId;
      for (const key in ticketData) {

        if (key != "extraServices" && key != "email") {
          ticket[key] = ticketData[key]
        }
        else if (key === "extraServices") {
          if (ticketData.extraServices) {
            for (const choosenExtraService of ticketData.extraServices) {
              let extraService = null;

              if (extraServicesMap[choosenExtraService.id]) {
                extraService = extraServicesMap[choosenExtraService.id];
              }
              else {
                extraService = await this.extraServicesRepository.findOne({ where: { id: choosenExtraService.id } });
                extraServicesMap[choosenExtraService.id] = extraService;
              }

              ticket.extraServices.push(extraService);
            }
          }
        }
        else {
          if (ticketData.email) {
            const remindDate = new Date(ticketData.departureDate);


            remindDate.setTime(remindDate.getTime() - (24 * 60 * 60 * 1000));

            remindPayloads.push(
              {
                trainData: {
                  trainNumber: ticketData.trainNumber,
                  departure: ticketData.departurePoint,
                  departureDate: ticketData.departureDate,
                  arrival: ticketData.arrivalPoint,
                  arrivalDate: ticketData.arrivalDate,
                },
                user: {
                  firstname: ticketData.name,
                  lastname: ticketData.lastname,
                  email: ticketData.email
                },
                date: remindDate
              });
          }
        }
      }



      tickets.push(ticket);
    }

    await this.ticketRepository.save(tickets);


    if (remindPayloads.length) {
      await lastValueFrom(this.ticketNotificationProxy.emit({ cmd: ADD_REMIND_NOTIFICATION }, remindPayloads));
    }

    return true;
  }

  async cancelTicket(ticketId: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    ticket.status = TicketStatus.CANCELLED;
    await lastValueFrom(this.ticketTrainProxy.send({ cmd: UPDATE_PLACE_STATUS }, { placeId: ticket.placeId, isOccupied: false }));
    await this.ticketRepository.save(ticket);
    return true;
  }

  async getTicketsHistory(userId: number): Promise<TicketDataDto[]> {
    const tickets = await this.ticketRepository.find({ where: { userId }, relations: ["extraServices"] });
    return tickets.map(ticket => {
      const ticketDto: TicketDataDto = {
        ...ticket
      }
      return ticketDto;
    })


  }

  async getTrainTicketsOwners(trainId: number) {
    return (await this.ticketRepository.find({ where: { trainId } })).map(ticket => ticket.userId);
  }

  async downloadTicket(ticketId: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId }, relations: ["extraServices"] });

    if (!ticket) throw new NotFoundException();


    const X_SPACING = 325;
    const ROW_SPACING_Y = 28;
    const START_ROW_Y = 705;
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
      trainNumber: ticket.trainNumber,
      carriageNumber: ticket.carriageNumber,
      placeNumber: ticket.placeNumber,
      departure: ticket.departurePoint,
      arrival: ticket.arrivalPoint,
      departureDate: ticket.departureDate,
      arrivalDate: ticket.arrivalDate,
      extraServices: ticket.extraServices.map(serv => serv.name),
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
      return extraServices.length ? extraServices.join(', ') : "Сервіси не були замовленні";
    }

    for (let row = 0, currentRowY = START_ROW_Y; row < ROWS; row++, currentRowY -= ROW_SPACING_Y) {
      const propName = PROPS[row];

      switch (propName) {
        case 'departureDate':
        case 'arrivalDate':
          page.drawText(getTrainFormattedDate(ticketData[propName]), { x: X_SPACING, y: currentRowY, font: font, size: FONT_SIZE });
          break;
        case 'extraServices':
          page.drawText(getExtraServicesFormattedString(ticketData[propName]), { x: X_SPACING, y: currentRowY, font: font, size: FONT_SIZE });
          break;
        default:
          page.drawText(String(ticketData[propName]), { x: X_SPACING, y: currentRowY, font: font, size: FONT_SIZE });
          break;
      }

    }

    //QR CODE

    const qrData = `
    Flight: №${ticketData.trainNumber}
    Carriage: ${ticketData.carriageNumber}
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


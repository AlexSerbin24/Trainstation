import { Inject, Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Between } from 'typeorm';
import { Train, TrainStatus, TrainType } from '../../entities/train.entity';
import { Station } from '../../entities/station.entity';
import { Carriage } from '../../entities/carriage.entity';
import { RouteSegment } from '../../entities/routeSegment.entity';
import { TrainUpdate, TrainCreate, TrainsSearch, CreateCarriage, CarriageType } from '@app/dtos';
import { TRAIN_AUTH_SERVICE, TRAIN_NOTIFICATION_SERVICE, TRAIN_TICKET_SERVICE } from '../../constants/service.constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CarriagePlace } from '../../entities/carriagePlace.entity';
import { CANCEL_TRAIN_NOTIFICATION, GET_TRAIN_TICKETS_OWNERS, GET_USERS_EMAILS, UPDATE_TRAIN_NOTIFICATION } from '@app/messages';
import { format } from 'date-fns';

@Injectable()
export class TrainService {
  constructor(
    @Inject(TRAIN_NOTIFICATION_SERVICE)
    private readonly trainNotificationProxy: ClientProxy,
    @Inject(TRAIN_TICKET_SERVICE)
    private readonly trainTicketProxy: ClientProxy,
    @Inject(TRAIN_AUTH_SERVICE)
    private readonly trainAuthProxy: ClientProxy,
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
    @InjectRepository(Carriage)
    private carriageRepository: Repository<Carriage>,
    @InjectRepository(CarriagePlace)
    private carriagesPlacesRepository: Repository<CarriagePlace>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(RouteSegment)
    private routeSegmentRepository: Repository<RouteSegment>
  ) { }

  async findAllTrains(): Promise<Train[]> {
    return await this.trainRepository.find();
  }

  async findTrainsByRouteAndDate(trainsSearchData: TrainsSearch): Promise<Train[]> {
    const { departureStation, arrivalStation, departureTime } = trainsSearchData;


    const departureStationObj = await this.stationRepository.findOne({ where: { name: departureStation } });
    const arrivalStationObj = await this.stationRepository.findOne({ where: { name: arrivalStation } });

    if (!departureStationObj || !arrivalStationObj) {
      throw new Error('Stations were not found');
    }


    const departureTimeEndOfDay = new Date(departureTime);
    departureTimeEndOfDay.setHours(23);
    departureTimeEndOfDay.setMinutes(59);


    const routeSegments = await this.routeSegmentRepository.find({
      where: {
        station: departureStationObj,
        departureTime: Between(departureTime, departureTimeEndOfDay),
      }
    });

    const trains: Train[] = [];
    const relations = trainsSearchData.extraData ? ["trainUnits", "trainUnits.carriagePlaces", "routeSegments"] : []
    for (const departureSegment of routeSegments) {
      const train = await this.trainRepository.findOne({ where: { id: departureSegment.trainId, trainStatus: TrainStatus.AwaitingDeparture }, relations });
      if (train && train.routeSegments.some(seg => seg.stationId === arrivalStationObj.id && departureSegment.id < seg.id)) {
        trains.push(train);
      }
    }

    return trains;
  }

  async findTrainById(id: number, extraData: boolean): Promise<Train> {
    const relations = extraData ? ["trainUnits", "trainUnits.carriagePlaces", "routeSegments"] : []
    return await this.trainRepository.findOne({ where: { id }, relations });
  }


  async createTrain(trainData: TrainCreate): Promise<Train> {
    const { trainNumber, stations, carriages } = trainData;

    const trainType = TrainType[trainData.trainType];

    // Створення нового рейсу
    const newTrain = this.trainRepository.create({
      trainNumber,
      trainType,
    });

    const savedTrain = await this.trainRepository.save(newTrain);
    const routeSegments = []

    for (let i = 0; i < stations.length; i++) {

      const stationData = stations[i]
      const station = await this.stationRepository.findOne({ where: { id: stationData.stationId } });
      if (!station) {
        throw new Error(`Station with id ${stationData.stationId} not found`);
      }

      // Перевірка для початкової та кінцевої станції
      if (i === 0 && stationData.arrivalDate) {
        throw new Error(`Arrival date should not be specified for the initial station`);
      }
      if (i === stations.length - 1 && stationData.departureDate) {
        throw new Error(`Departure date should not be specified for the final station`);
      }


      const newRouteSegment = this.routeSegmentRepository.create({
        trainId: savedTrain.id,
        station,
        departureTime: stationData.departureDate,
        arrivalTime: stationData.arrivalDate
      });
      routeSegments.push(newRouteSegment);
    }

    const createdSegments = await this.routeSegmentRepository.save(routeSegments);

    savedTrain.routeSegments = createdSegments;


    // Створення вагонів

    await this.addNewCarriages(savedTrain.id, carriages);

    await this.trainRepository.save(savedTrain);

    return savedTrain;
  }

  //
  async updateTrain(id: number, trainData: TrainUpdate): Promise<Train> {
    //Carriages
    const carriages = await this.carriageRepository.find({ where: { trainId: id }, relations: ["carriagePlaces"] });

    const newCarriages = trainData.carriages.filter(carriage => carriage.id === undefined);

    const existingCarriageIds = trainData.carriages.map(carriage => carriage.id);

    await this.addNewCarriages(id, newCarriages);

    const carriagesToRemove = carriages.filter(carriage => !existingCarriageIds.includes(carriage.id)).filter(carriage => carriage.carriagePlaces.every(place => !place.isOccupied));

    await this.removeCarriages(carriagesToRemove);

    //Stations
    const routeSegments = await this.routeSegmentRepository.find({ where: { trainId: id }, relations: ["station"] });

    for (let i = 0; i < trainData.stations.length; i++) {
      const stationData = trainData.stations[i];
      const existingSegment = routeSegments.find(segment => segment.stationId === stationData.stationId);

      if (i === 0 && stationData.arrivalDate) {
        throw new Error(`Arrival date should not be specified for the initial station`);
      }
      if (i === trainData.stations.length - 1 && stationData.departureDate) {
        throw new Error(`Departure date should not be specified for the final station`);
      }

      if (existingSegment) {

        // Обновление существующего сегмента маршрута
        existingSegment.departureTime = stationData.departureDate;
        existingSegment.arrivalTime = stationData.arrivalDate;


        await this.routeSegmentRepository.save(existingSegment);
      } else {
        // Добавление нового сегмента маршрута
        const station = await this.stationRepository.findOne({ where: { id: stationData.stationId } });
        if (!station) {
          throw new Error(`Station with id ${stationData.stationId} not found`);
        }

        const newRouteSegment = this.routeSegmentRepository.create({
          train: { id },
          station,
          departureTime: stationData.departureDate,
          arrivalTime: stationData.arrivalDate
        });

        await this.routeSegmentRepository.save(newRouteSegment);
      }
    }
    /*Send message */

    const train = await this.trainRepository.findOne({ where: { id }, relations: ["trainUnits", "trainUnits.carriagePlaces", "routeSegments", "routeSegments.station"] });


    const usersData = await this.getUsersDataForNotification(train.id)
    if (usersData.length)
      await lastValueFrom(this.trainNotificationProxy.emit({ cmd: UPDATE_TRAIN_NOTIFICATION }, {

        users: usersData,
        trainData: {
          trainNumber: train.trainNumber,
          routeSegments: train.routeSegments.map(segm => ({ station: segm.station.name, departureDate: segm.departureTime, arrivalDate: segm.arrivalTime }))
        }
      }));



    return train;
  }

  async removeTrain(id: number): Promise<boolean> {
    const trainToRemove = await this.trainRepository.findOne({ where: { id } });
    if (!trainToRemove) {
      throw new Error(`Train with id ${id} not found`);
    }

    await this.trainRepository.remove(trainToRemove);

    /*Send message */

    const usersData = await this.getUsersDataForNotification(id);
    if (usersData.length)
      await lastValueFrom(this.trainNotificationProxy.emit({ cmd: CANCEL_TRAIN_NOTIFICATION }, {
        users: usersData,
        trainData: {
          trainNumber: trainToRemove.trainNumber,
        }
      }));

    return true;
  }

  async updatePlaceStatus(placeId: number, isOccupied: boolean) {
    const place = await this.carriagesPlacesRepository.findOne({ where: { id: placeId } });
    place.isOccupied = isOccupied;

    await this.carriagesPlacesRepository.save(place);
    return true;
  }

  async getStations(): Promise<Station[]> {
    return await this.stationRepository.find();
  }

  private async addNewCarriages(trainId: number, newCarriages: CreateCarriage[]): Promise<Carriage[]> {
    if (!newCarriages.length) return;

    const carriagesToAdd = newCarriages.map(carriage => ({
      ...carriage,
      carriageType: CarriageType[carriage.carriageType.toUpperCase()],
      trainId
    }));

    const savedCarriages = await this.carriageRepository.save(carriagesToAdd);

    return savedCarriages
  }

  private async removeCarriages(carriagesToRemove: Carriage[]): Promise<void> {
    await this.carriageRepository.remove(carriagesToRemove);
  }


  private async getUsersDataForNotification(trainId: number) {
    const usersIds = await lastValueFrom(this.trainTicketProxy.send<number[]>({ cmd: GET_TRAIN_TICKETS_OWNERS }, trainId));

    const usersData = usersIds.length ? await lastValueFrom(this.trainAuthProxy.send<
      {
        email: string,
        firstname: string,
        lastname: string

      }[]>({ cmd: GET_USERS_EMAILS }, usersIds)) : [];

    return usersData;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Between } from 'typeorm';
import { Train, TrainStatus, TrainType } from '../../entities/train.entity';
import { Station } from '../../entities/station.entity';
import { Carriage } from '../../entities/carriage.entity';
import { CreateCarriage, TrainCreateInput } from '../../inputTypes/trainCreate.input';
import { TrainsSearchInput } from '../../inputTypes/trainsSearch.input.';
import { RouteSegment } from '../../entities/routeSegment.entity';
import { TrainUpdateInput } from 'src/inputTypes/trainUpdate.input';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
    @InjectRepository(Carriage)
    private carriageRepository: Repository<Carriage>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(RouteSegment)
    private routeSegmentRepository: Repository<RouteSegment>
  ) { }

  async findAllTrains(): Promise<Train[]> {
    return await this.trainRepository.find();
  }

  async findTrainsByRouteAndDate(trainsSearchData: TrainsSearchInput): Promise<Train[]> {
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
    for (const departureSegment of routeSegments) {
      const train = await this.trainRepository.findOne({ where: { id: departureSegment.trainId, trainStatus: TrainStatus.AwaitingDeparture } });
      if (train && train.routeSegments.some(seg => seg.stationId === arrivalStationObj.id && departureSegment.id < seg.id)) {
        trains.push(train);
      }
    }

    return trains;
  }

  async findTrainById(id: number): Promise<Train> {
    return await this.trainRepository.findOne({ where: { id } });
  }


  //TODO: add checking if all stations departure and arrival times are in а correct order
  async createTrain(trainData: TrainCreateInput): Promise<Train> {
    const { trainNumber, trainType, stations, carriages } = trainData;

    // Створення нового рейсу
    const newTrain = this.trainRepository.create({
      trainNumber,
      trainType,
    });

    const savedTrain = await this.trainRepository.save(newTrain);

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
        train: savedTrain,
        station,
        departureTime: stationData.departureDate,
        arrivalTime: stationData.arrivalDate
      });
      savedTrain.routeSegments.push(newRouteSegment);
    }

    // Створення вагонів

    await this.addNewCarriages(savedTrain.id, carriages);

    return savedTrain;
  }

  //!!!!!
  //TODO: interaction with notification service and ticket serive for adding stations
  async updateTrain(id: number, trainData: TrainUpdateInput): Promise<Train> {
    const carriages = await this.carriageRepository.find({ where: { trainId: id } });

    const newCarriages = trainData.carriages.filter(carriage => carriage.id === undefined);
    const existingCarriageIds = trainData.carriages.map(carriage => carriage.id);


    await this.addNewCarriages(id, newCarriages);

    const carriagesToRemove = carriages.filter(carriage => !existingCarriageIds.includes(carriage.id));
    await this.removeCarriages(carriagesToRemove);

    // await this.updateStations(trainData.stations);

    return await this.trainRepository.findOne({where:{id}});
  }

  // Метод для добавления новых вагонов к рейсу
  private async addNewCarriages(trainId: number, newCarriages: CreateCarriage[]): Promise<Carriage[]> {
    const carriagesToAdd = newCarriages.map(carriage => ({
      ...carriage,
      trainId
    }));

    const savedCarriages = await this.carriageRepository.save(carriagesToAdd);

    return savedCarriages
  }

  private async removeCarriages(carriagesToRemove: Carriage[]): Promise<void> {
    await this.carriageRepository.remove(carriagesToRemove);
  }


  //Todo: interaction with notification service
  async removeTrain(id: number): Promise<number> {
    const trainToRemove = await this.trainRepository.findOne({ where: { id } });
    if (!trainToRemove) {
      throw new Error(`Train with id ${id} not found`);
    }

    return (await this.trainRepository.remove(trainToRemove)).id
  }


  async getStations(): Promise<Station[]> {
    return await this.stationRepository.find();
  }
}

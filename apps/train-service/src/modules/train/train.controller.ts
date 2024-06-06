import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TrainService } from './train.service';
import { TrainCreate, TrainUpdate, TrainsSearch } from '@app/dtos';
import { StationDto, TrainDto } from '@app/dtos';
import { FIND_ALL_TRAINS, FIND_TRAINS_BY_ROUTE_AND_DATE, FIND_TRAIN_BY_ID, CREATE_TRAIN, UPDATE_TRAIN, REMOVE_TRAIN, GET_STATIONS, UPDATE_PLACE_STATUS } from '@app/messages';


@Controller()
export class TrainController {
  constructor(private readonly trainService: TrainService) { }

  @MessagePattern({cmd:FIND_ALL_TRAINS}) // Обработка сообщения от брокера
  async findAllTrains(): Promise<TrainDto[]> {
    return await this.trainService.findAllTrains();
  }

  @MessagePattern({cmd:FIND_TRAINS_BY_ROUTE_AND_DATE}) // Обработка сообщения от брокера
  async findTrainsByRouteAndDate(trainsSearchData: TrainsSearch): Promise<TrainDto[]> {
    return await this.trainService.findTrainsByRouteAndDate(trainsSearchData);
  }

  @MessagePattern({cmd:FIND_TRAIN_BY_ID}) // Обработка сообщения от брокера
  async findTrainById(@Payload() data: { id: number, extraData: boolean }): Promise<TrainDto> {
    const { id, extraData } = data;
    return await this.trainService.findTrainById(id, extraData);
  }

  @MessagePattern({cmd:CREATE_TRAIN}) // Обработка сообщения от брокера
  async createTrain(@Payload() trainData: TrainCreate): Promise<TrainDto> {
    return await this.trainService.createTrain(trainData);
  }

  @MessagePattern({cmd:UPDATE_TRAIN}) // Обработка сообщения от брокера
  async updateTrain(@Payload() data: { id: number, trainData: TrainUpdate }): Promise<TrainDto> {
    const { id, trainData } = data;
    return await this.trainService.updateTrain(id, trainData);
  }

  @MessagePattern({cmd:REMOVE_TRAIN}) // Обработка сообщения от брокера
  async removeTrain(@Payload() id: number): Promise<boolean> {
    return await this.trainService.removeTrain(id);
  }

  @MessagePattern({cmd:UPDATE_PLACE_STATUS})
  async updatePlaceStatus(@Payload() data:{placeId:number, isOccupied:boolean}){
    const {placeId,isOccupied} = data;
    return await this.trainService.updatePlaceStatus(placeId,isOccupied)
  }

  @MessagePattern({cmd:GET_STATIONS}) // Обработка сообщения от брокера
  async getStations(): Promise<StationDto[]> {
    return await this.trainService.getStations();
  }
}

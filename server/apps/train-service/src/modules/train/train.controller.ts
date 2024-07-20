import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TrainService } from './train.service';
import { TrainCreate, TrainDataForUpdate, TrainDetailsWithCarriage, TrainUpdate, TrainsSearch } from '@app/dtos';
import { StationDto, TrainDto } from '@app/dtos';
import { FIND_ALL_TRAINS, FIND_TRAINS_BY_ROUTE_AND_DATE, FIND_TRAIN_BY_ID, CREATE_TRAIN, UPDATE_TRAIN, REMOVE_TRAIN, GET_STATIONS, UPDATE_PLACE_STATUS, FIND_TRAIN_FOR_TICKETING, FIND_TRAIN_FOR_UPDATE } from '@app/messages';
import { handleRpcError } from '@app/utils';


@Controller()
export class TrainController {
  constructor(private readonly trainService: TrainService) { }

  @MessagePattern({ cmd: FIND_ALL_TRAINS }) // Обработка сообщения от брокера
  async findAllTrains(): Promise<TrainDto[]> {
    try {
      return await this.trainService.findAllTrains();
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: FIND_TRAIN_FOR_UPDATE })
  async findTrainForUpdate(@Payload() id: number ): Promise<TrainDataForUpdate> {
    try {
      return await this.trainService.findTrainForUpdate(id);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: FIND_TRAINS_BY_ROUTE_AND_DATE }) // Обработка сообщения от брокера
  async findTrainsByRouteAndDate(trainsSearchData: TrainsSearch) {
    try {
      return await this.trainService.findTrainsByRouteAndDate(trainsSearchData);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: FIND_TRAIN_FOR_TICKETING }) // Обработка сообщения от брокера
  async findTrainForTicketing(@Payload() data: { id: number, route: { departurePoint: string, arrivalPoint: string } }): Promise<TrainDetailsWithCarriage> {
    try {
      const { id, route } = data;
      return await this.trainService.findTrainForTicketing(id, route);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: CREATE_TRAIN }) // Обработка сообщения от брокера
  async createTrain(@Payload() trainData: TrainCreate): Promise<TrainDto> {
    try {
      return await this.trainService.createTrain(trainData);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: UPDATE_TRAIN }) // Обработка сообщения от брокера
  async updateTrain(@Payload() data: { id: number, trainData: TrainUpdate }): Promise<TrainDto> {
    try {
      const { id, trainData } = data;
      return await this.trainService.updateTrain(id, trainData);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: REMOVE_TRAIN }) // Обработка сообщения от брокера
  async removeTrain(@Payload() id: number): Promise<boolean> {
    try {
      return await this.trainService.removeTrain(id);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: UPDATE_PLACE_STATUS })
  async updatePlaceStatus(@Payload() data: { placeId: number, isOccupied: boolean }) {
    try {
      const { placeId, isOccupied } = data;
      return await this.trainService.updatePlaceStatus(placeId, isOccupied)
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern({ cmd: GET_STATIONS }) // Обработка сообщения от брокера
  async getStations(): Promise<StationDto[]> {
    try {
      return await this.trainService.getStations();
    } catch (error) {
      handleRpcError(error);
    }
  }
}

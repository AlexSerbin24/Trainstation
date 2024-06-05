import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { StationDto, TrainDto } from '@app/dtos/train/train-entities.dto';
import { TrainCreate, TrainUpdate, TrainsSearch } from '@app/dtos/train/train-shared.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CREATE_TRAIN, FIND_ALL_TRAINS, FIND_TRAINS_BY_ROUTE_AND_DATE, GET_STATIONS, REMOVE_TRAIN, UPDATE_TRAIN } from '@app/messages';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { GATEWAY_TRAIN_SERVICE } from '../constants/services.constants';

@Controller('train')
export class TrainServiceController {
    constructor(
        @Inject(GATEWAY_TRAIN_SERVICE)
        private readonly gatewayTrainProxy: ClientProxy,
    ) { }

    @Get('/stations')
    async getStations(): Promise<StationDto[]> {
        return await lastValueFrom(this.gatewayTrainProxy.send<StationDto[]>({ cmd: GET_STATIONS }, {}));
    }


    @Get('/all')
    @Roles("admin")
    @UseGuards(AuthGuard(["jwt"]), RolesGuard)
    async findAllTrains(): Promise<TrainDto[]> {
        return await lastValueFrom(this.gatewayTrainProxy.send<TrainDto[]>({ cmd: FIND_ALL_TRAINS }, {}));
    }

    @Get('/search')
    async findTrainsByRouteAndDate(@Body() trainsSearchData: Omit<TrainsSearch,"extraData">): Promise<TrainDto[]> {
        return await lastValueFrom(this.gatewayTrainProxy.send<TrainDto[]>({ cmd: FIND_TRAINS_BY_ROUTE_AND_DATE }, {...trainsSearchData,extraData:false}));
    }

    @Get('/:id')
    @UseGuards(AuthGuard(["jwt"]))
    async findTrainById(@Param('id') id: number): Promise<TrainDto> {
        return await lastValueFrom(this.gatewayTrainProxy.send<TrainDto>({ cmd: FIND_ALL_TRAINS }, id));
    }

    @Post('/create')
    @Roles("admin")
    @UseGuards(AuthGuard(["jwt"]), RolesGuard)
    async createTrain(@Body() trainData: TrainCreate): Promise<TrainDto> {
        const createdTrain = await lastValueFrom(this.gatewayTrainProxy.send<TrainDto>({ cmd: CREATE_TRAIN }, trainData));
        return createdTrain;
    }

    @Put('/:id')
    @Roles("admin")
    @UseGuards(AuthGuard(["jwt"]), RolesGuard)
    async updateTrain(@Param('id') id: number, @Body() trainData: TrainUpdate): Promise<TrainDto> {
        const updatedTrain = await lastValueFrom(this.gatewayTrainProxy.send<TrainDto>({ cmd: UPDATE_TRAIN }, { id, trainData }));
        return updatedTrain;
    }

    @Delete('/:id')
    @Roles("admin")
    @UseGuards(AuthGuard(["jwt"]), RolesGuard)
    async removeTrain(@Param('id') id: number): Promise<boolean> {
        return await lastValueFrom(this.gatewayTrainProxy.send<boolean>({ cmd: REMOVE_TRAIN }, id));
    }

}
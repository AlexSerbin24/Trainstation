import { Module } from '@nestjs/common';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from '../../entities/train.entity';
import { Carriage } from '../../entities/carriage.entity';
import { Station } from '../../entities/station.entity';
import { RouteSegment } from '../../entities/routeSegment.entity';
import { CarriagePlace } from '../../entities/carriagePlace.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Carriage,CarriagePlace,RouteSegment,Station,Train])],
  controllers:[TrainController],
  providers: [TrainService]
})
export class TrainModule { }

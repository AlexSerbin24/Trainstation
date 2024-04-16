import { Module } from '@nestjs/common';
import { TrainResolver } from './train.resolver';
import { TrainService } from './train.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from 'src/entities/train.entity';
import { Carriage } from 'src/entities/carriage.entity';
import { Station } from 'src/entities/station.entity';
import { RouteSegment } from 'src/entities/routeSegment.entity';
import { CarriagePlace } from 'src/entities/carriagePlace.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Carriage,CarriagePlace,RouteSegment,Station,Train])],
  providers: [TrainService, TrainResolver]
})
export class TrainModule { }

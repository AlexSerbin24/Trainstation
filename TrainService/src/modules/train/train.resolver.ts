import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TrainService } from './train.service';
import { Train, TrainType } from '../../entities/train.entity';
import { TrainCreateInput } from '../../inputTypes/trainCreate.input';
import { TrainsSearchInput } from '../../inputTypes/trainsSearch.input.';
import { TrainUpdateInput } from '../../inputTypes/trainUpdate.input';
import { Carriage } from '../../entities/carriage.entity';
import { Station } from '../../entities/station.entity';

@Resolver()
export class TrainResolver {
  constructor(private readonly trainService: TrainService) { }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Query(returns => [Train])
  async findAllTrains(): Promise<Train[]> {
    return await this.trainService.findAllTrains();
  }

  @Query(returns => [Train], { name: "findTrainsByRouteAndDate" })
  async findTrainsByRouteAndDate(@Args('trainsSearchData') trainsSearchData: TrainsSearchInput): Promise<Train[]> {
    return await this.trainService.findTrainsByRouteAndDate(trainsSearchData);
  }

  @Query(returns => Train, { name: "findTrainById" })
  async findTrainById(@Args('id') id: number): Promise<Train> {
    return await this.trainService.findTrainById(id);
  }

  @Mutation(returns => Train, { name: 'createTrain' })
  async createTrain(@Args('trainData') trainData: TrainCreateInput): Promise<Train> {
    return await this.trainService.createTrain(trainData);
  }


  @Mutation(returns => Train, { name: 'createTrain' })
  async updateTrain(@Args('id') id: number, @Args('trainData') trainData: TrainUpdateInput): Promise<Train> {
    return await this.trainService.updateTrain(id, trainData);
  }

  @Mutation(returns => Int, { name: 'removeTrain' })
  async removeTrain(@Args('id') id: number): Promise<number> {
    return await this.trainService.removeTrain(id);
  }


  @Query(returns => [Station])
  async getStations(): Promise<Station[]> {
    return await this.trainService.getStations();
  }
}

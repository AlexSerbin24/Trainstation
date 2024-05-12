import { InputType, PickType } from '@nestjs/graphql';
import {  TrainCreateInput } from './trainCreate.input';

@InputType()
export class TrainUpdateInput extends PickType(TrainCreateInput, ['stations', 'carriages'] as const){}





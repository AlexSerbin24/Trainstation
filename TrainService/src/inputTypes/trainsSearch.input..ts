import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class TrainsSearchInput {
  @Field()
  departureStation: string;

  @Field()
  arrivalStation: string;

  @Field()
  departureTime: Date;
}
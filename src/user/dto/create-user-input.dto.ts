import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  walletAddress: string;

  @Field()
  dob: string;
}
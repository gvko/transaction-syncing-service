import { Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  signup(): boolean {
    return true;
  }

  @Mutation(() => Boolean)
  login(): boolean {
    return true;
  }
}

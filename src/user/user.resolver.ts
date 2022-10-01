import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => Boolean)
  getUser(): boolean {
    return true;
  }
}

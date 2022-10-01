import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {
  }

  @Query(() => Boolean)
  me(): boolean {
    return true;
  }
}

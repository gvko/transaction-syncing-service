import { Context, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Resolver()
export class UserResolver {
  @Query(() => UserEntity)
  @UseGuards(new AuthGuard())
  auth(@Context('user') user: UserEntity): UserEntity {
    return user;
  }
}

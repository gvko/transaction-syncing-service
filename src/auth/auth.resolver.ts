import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/user.entity';
import { CreateUserInput } from '../user/dto/create-user-input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService, private userService: UserService) {
  }

  @Mutation(() => String)
  async login(@Args('walletAddress') walletAddress: string): Promise<string> {
    const user = await this.userService.getByWalletAddress(walletAddress);

    return this.authService.createToken(user);
  }

  @Mutation(() => UserEntity)
  signup(@Args('input') input: CreateUserInput): Promise<UserEntity> {
    return this.userService.create(input);
  }
}

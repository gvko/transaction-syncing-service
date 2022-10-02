import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/create-user-input.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService, private userService: UserService) {
  }

  @Mutation(() => String)
  async login(@Args('walletAddress') walletAddress: string): Promise<string> {
    const user = await this.userService.getByWalletAddress(walletAddress);

    return this.authService.createToken(user);
  }

  @Mutation(() => String)
  async signup(@Args('input') input: CreateUserInput): Promise<string> {
    const user = await this.userService.create(input);
    return this.authService.createToken(user);
  }
}

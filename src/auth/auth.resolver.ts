import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Mutation(() => String)
  async login(@Args('walletAddress') walletAddress: string): Promise<string> {
    const user = await this.userService.getByWalletAddress(walletAddress);

    return this.authService.createToken(user);
  }

  @Mutation(() => Boolean)
  signup(): boolean {
    return true;
  }
}

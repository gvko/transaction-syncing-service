import { Args, Query, Resolver } from '@nestjs/graphql';
import { EventEntity } from './event.entity';
import { Web3ProviderService } from './web3-provider.service';

@Resolver()
export class EventResolver {
  constructor(private web3ProviderService: Web3ProviderService) {
  }

  @Query(() => EventEntity)
  async getEvents(@Args('block') block: number): Promise<EventEntity[]> {
    return this.web3ProviderService.getEventsByBlock(block);
  }
}

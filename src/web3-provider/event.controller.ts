import { EventEntity } from './event.entity';
import { Web3ProviderService } from './web3-provider.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class EventController {
  constructor(private web3ProviderService: Web3ProviderService) {
  }

  @Get(':block')
  async getEvents(@Param('block') block: number): Promise<EventEntity[]> {
    return this.web3ProviderService.getEventsByBlock(block);
  }
}

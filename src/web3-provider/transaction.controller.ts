import { TransactionEntity } from './transaction.entity';
import { Web3ProviderService } from './web3-provider.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class TransactionController {
  constructor(private web3ProviderService: Web3ProviderService) {
  }

  @Get(':block')
  async getEvents(@Param('block') block: number): Promise<TransactionEntity[]> {
    return this.web3ProviderService.getTxsFromBlock(block);
  }
}

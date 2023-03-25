import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CHAIN } from '../common/chain';
import { TxsForAddressAndChainResult } from './types';

@Controller('transactions')
export class TransactionController {
  constructor(private txService: TransactionService) {
  }

  @Get()
  async getTxsForAddressAndChain(
    @Query('addresses') addresses: string,
    @Query('chains') chains: string,
  ): Promise<TxsForAddressAndChainResult> {
    const addressesSplit = addresses.split(',');
    const chainsSplit: CHAIN[] = chains.split(',') as CHAIN[];

    for (const chain of chainsSplit) {
      if (!(chain in CHAIN)) {
        throw new BadRequestException(`"${chain}" is not a valid chain type`);
      }
    }
    return this.txService.getTxsForAddressAndChain(addressesSplit, chainsSplit);
  }
}

import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CHAIN } from '../common/chain';
import { TxsForAddressAndChainResult } from './types';
import { Web3ProviderService } from '../web3-provider/web3-provider.service';
import { IsString } from 'class-validator';

class IndexTxsForAddressDto {
  @IsString()
  chain: CHAIN;
}

@Controller('transactions')
export class TransactionController {
  constructor(private txService: TransactionService, private web3Service: Web3ProviderService) {
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

  @Post(':address')
  async indexTxsForAddress(@Param('address') address: string, @Body() txDto: IndexTxsForAddressDto): Promise<void> {
    await this.web3Service.indexTxsForAddress(txDto.chain, address);
  }
}

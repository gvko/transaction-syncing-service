import { TransactionEntity } from './transaction.entity';
import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private transactionsService: TransactionService) {
  }

  @Get(':address')
  async getTxsForAddress(@Param('address') block: number): Promise<TransactionEntity[]> {
    return [];
  }
}

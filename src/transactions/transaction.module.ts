import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Web3ProviderModule } from '../web3-provider/web3-provider.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), forwardRef(() => Web3ProviderModule)],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {
}

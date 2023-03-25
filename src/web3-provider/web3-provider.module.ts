import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { Web3ProviderService } from './web3-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionController, Web3ProviderService],
  exports: [Web3ProviderService],
})
export class Web3ProviderModule {
}

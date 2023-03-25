import { forwardRef, Module } from '@nestjs/common';
import { Web3ProviderService } from './web3-provider.service';
import { TransactionModule } from '../transactions/transaction.module';

@Module({
  imports: [forwardRef(() => TransactionModule)],
  providers: [Web3ProviderService],
  exports: [Web3ProviderService],
})
export class Web3ProviderModule {
}

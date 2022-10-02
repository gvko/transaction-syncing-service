import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { EventResolver } from './event.resolver';
import { Web3ProviderService } from './web3-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventResolver, Web3ProviderService],
  exports: [Web3ProviderService],
})
export class Web3ProviderModule {
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './common/config';
import ormConfig from './common/orm-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transactions/transaction.module';
import { Web3ProviderModule } from './web3-provider/web3-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot(ormConfig),
    TransactionModule,
    Web3ProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

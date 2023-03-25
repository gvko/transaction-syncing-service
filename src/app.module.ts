import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Web3ProviderModule } from './web3-provider/web3-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV === 'docker-local' ? 'coinshift-db' : 'localhost',
      port: 5432,
      username: 'chewbacca',
      password: 'rawr',
      database: 'coinshift',
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrationsRun: true,
    }),
    Web3ProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import { CreateEventInput } from './dto/create-event-input.dto';
import { ethers } from 'ethers';
import { config } from '../config';

@Injectable()
export class Web3ProviderService {
  private readonly logger: Logger;
  private readonly provider: ethers.providers.AlchemyProvider;
  private readonly eventAbi: string[];
  private readonly eventInterface: ethers.utils.Interface;
  private readonly eventFilters: any;

  constructor(@InjectRepository(EventEntity) private eventEntity: Repository<EventEntity>) {
    this.logger = new Logger(Web3ProviderService.name);
    this.provider = new ethers.providers.AlchemyProvider('mainnet', config().ethereumNode.apiKey);
    this.eventAbi = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
    this.eventInterface = new ethers.utils.Interface(this.eventAbi);
    this.eventFilters = {
      contractAddress: config().ethereumNode.contractAddress,
      topics: [
        ethers.utils.id('Transfer(address,address,uint256)'),
      ],
    };

    this.initSync();
  }

  initSync(): void {
    this.logger.log('Initialize syncing of Transfer events');

    this.provider.on(this.eventFilters, async (event) => {
      console.log(event);
      const parsedEvent = this.eventInterface.parseLog(event);

      await this.create({
        fromAddress: parsedEvent.args.from.toLowerCase(),
        toAddress: parsedEvent.args.to.toLowerCase(),
        value: parsedEvent.args.value.toString(),
        block: event.blockNumber,
      });
    });
  }

  async create(dto: CreateEventInput): Promise<EventEntity> {
    this.logger.log({ msg: 'Storing new event', dto });
    return this.eventEntity
      .create({
        fromAddress: dto.fromAddress,
        toAddress: dto.toAddress,
        value: dto.value,
        block: dto.block,
      })
      .save();
  }

  async getEventsByBlock(block: number): Promise<EventEntity[]> {
    this.logger.log(`Getting events for block ${block}`);
    return [];
  }
}

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
  private readonly eventInterfaceTwoIndexed: ethers.utils.Interface;
  private readonly eventInterfaceThreeIndexed: ethers.utils.Interface;
  private readonly eventFilters: any;

  constructor(@InjectRepository(EventEntity) private eventEntity: Repository<EventEntity>) {
    this.logger = new Logger(Web3ProviderService.name);
    this.provider = new ethers.providers.AlchemyProvider('mainnet', config().ethereumNode.apiKey);

    const eventAbiTwoIndexed = [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ];
    const eventAbiThreeIndexed = [
      'event Transfer(address indexed from, address indexed to, uint256 indexed value)',
    ];
    this.eventInterfaceTwoIndexed = new ethers.utils.Interface(eventAbiTwoIndexed);
    this.eventInterfaceThreeIndexed = new ethers.utils.Interface(eventAbiThreeIndexed);

    this.eventFilters = {
      topics: [ethers.utils.id('Transfer(address,address,uint256)')],
    };

    this.initSync();
  }

  /**
   * Start event syncing and store parsed events into the DB
   */
  async initSync(): Promise<void> {
    this.logger.log('Initialize syncing of Transfer events');

    const latestEvent = await this.eventEntity.findOne({ where: {}, order: { createdAt: 'DESC' } });
    if (latestEvent) {
      this.eventFilters.fromBlock = latestEvent.block;
    }

    this.provider.on(this.eventFilters, async (event) => {
      let parsedEvent;

      if (event.topics.length === 3) {
        parsedEvent = this.eventInterfaceTwoIndexed.parseLog(event);
      } else {
        parsedEvent = this.eventInterfaceThreeIndexed.parseLog(event);
      }

      await this.create({
        fromAddress: parsedEvent.args.from.toLowerCase(),
        toAddress: parsedEvent.args.to.toLowerCase(),
        value: parsedEvent.args.value.toString(),
        block: event.blockNumber,
      });
    });
  }

  /**
   * Creates a new event record in the DB
   * @param {CreateEventInput}  dto
   * @return  {Promise<EventEntity>}
   */
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

  /**
   * Return the events for a given block, stored in the DB
   * @param {number}  block
   * @return  {Promise<EventEntity[]>}
   */
  async getEventsByBlock(block: number): Promise<EventEntity[]> {
    this.logger.log(`Getting events for block ${block}`);
    return this.eventEntity.find({ where: { block: block.toString() } });
  }
}

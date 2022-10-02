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
  private readonly provider;

  constructor(@InjectRepository(EventEntity) private eventEntity: Repository<EventEntity>) {
    this.logger = new Logger(Web3ProviderService.name);
  }

  async create(dto: CreateEventInput): Promise<EventEntity> {
    this.logger.log({ msg: 'Storing new event', dto });
    return this.eventEntity
      .create({
        fromAddress: dto.fromAddress,
        toAddress: dto.toAddress,
        // TODO: convert to wei before storing
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

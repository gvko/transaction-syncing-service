import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import { CreateEventInput } from './dto/create-event-input.dto';

@Injectable()
export class Web3ProviderService {
  constructor(@InjectRepository(EventEntity) private eventEntity: Repository<EventEntity>) {
  }

  async create(dto: CreateEventInput): Promise<EventEntity> {
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
    return [];
  }
}

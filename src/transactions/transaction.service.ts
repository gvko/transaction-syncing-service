import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction-input.dto';

@Injectable()
export class TransactionService {
  private readonly logger: Logger;
  private readonly provider;

  constructor(
    @InjectRepository(TransactionEntity) private transactionEntity: Repository<TransactionEntity>,
  ) {
    this.logger = new Logger(TransactionService.name);
  }

  /**
   * Start transactions syncing and store parsed transactions into the DB
   */
  async getMaxBlockStored(): Promise<number> {
    const queryResult = await this.transactionEntity
      .createQueryBuilder('transaction')
      .select('MAX(transaction.blockNumber)', 'maxBlockNumber')
      .getRawOne();
    return queryResult.maxBlockNumber;
  }

  /**
   * Creates a new transaction record in the DB
   *
   * @param {CreateTransactionInput}  dto
   * @return  {Promise<TransactionEntity>}
   */
  async create(dto: CreateTransactionInput): Promise<TransactionEntity> {
    return this.transactionEntity
      .create({
        hash: dto.hash,
        index: dto.index,
        fromAddress: dto.fromAddress,
        toAddress: dto.toAddress,
        value: dto.value,
        input: dto.input,
        blockNumber: dto.blockNumber,
        blockHash: dto.blockHash,
        chain: dto.chain,
        gas: dto.gas,
        gasPrice: dto.gasPrice,
        nonce: dto.nonce,
      })
      .save();
  }

  /**
   * Return the transactions for a given block, stored in the DB
   *
   * @param {number}  block
   * @return  {Promise<TransactionEntity[]>}
   */
  async getTxsForBlock(block: number): Promise<TransactionEntity[]> {
    return this.transactionEntity.find({ where: { blockNumber: block } });
  }
}

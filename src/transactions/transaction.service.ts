import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction-input.dto';
import { CHAIN } from '../common/chain';
import { TxsForAddressAndChainResult } from './types';

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
   *
   * @param {CHAIN} chain
   */
  async getMaxBlockStored(chain: CHAIN): Promise<number> {
    const queryResult = await this.transactionEntity
      .createQueryBuilder('transaction')
      .select('MAX(transaction.blockNumber)', 'maxBlockNumber')
      .where('transaction.chain = :chain', { chain })
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
   * Get the txs for multiple addresses across multiple chains, from the stored txs in the DB
   *
   * @param {string[]}  addresses
   * @param {CHAIN[]}   chains
   */
  async getTxsForAddressAndChain(
    addresses: string[],
    chains: CHAIN[],
  ): Promise<TxsForAddressAndChainResult> {
    const response = {};
    for (const address of addresses) {
      response[address] = {};

      for (const chain of chains) {
        response[address][chain] = await this.transactionEntity.find({
          where: {
            fromAddress: address,
            chain,
          },
        });
      }
    }

    return response;
  }
}

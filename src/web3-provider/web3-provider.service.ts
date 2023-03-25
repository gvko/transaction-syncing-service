import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction-input.dto';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { config } from '../config';
import { CHAIN } from '../common/chain';

@Injectable()
export class Web3ProviderService {
  private readonly logger: Logger;
  private readonly provider;
  private readonly eventInterfaceTwoIndexed: ethers.utils.Interface;
  private readonly eventInterfaceThreeIndexed: ethers.utils.Interface;
  private readonly eventFilters: any;

  constructor(@InjectRepository(TransactionEntity) private transactionEntity: Repository<TransactionEntity>) {
    this.logger = new Logger(Web3ProviderService.name);
    this.provider = new Web3(new Web3.providers.WebsocketProvider(config().ethNode.wsUrl));

    this.initSync();
  }

  /**
   * Start transactions syncing and store parsed transactions into the DB
   */
  async initSync(): Promise<void> {
    this.logger.log('Initialize syncing of transactions');

    const queryResult = await this.transactionEntity
      .createQueryBuilder('transaction')
      .select('MAX(transaction.blockNumber)', 'maxBlockNumber')
      .getRawOne();
    const maxBlockNumberInDB = queryResult.maxBlockNumber;
    const latestBlockNumber = await this.provider.eth.getBlockNumber();

    if (maxBlockNumberInDB < latestBlockNumber) {
      this.logger.log(
        `Sync past txs from block ${maxBlockNumberInDB} to latest block (${latestBlockNumber})`,
      );
      for (let blockNr = maxBlockNumberInDB + 1; blockNr <= latestBlockNumber; blockNr++) {
        await this.getAndStoreTxsForBlock(blockNr);
      }
      this.logger.log(`Syncing past txs done`);
    }

    this.provider.eth.subscribe('newBlockHeaders', async (err, header) => {
      if (err) {
        this.logger.error(`Could not sync block`, err);
      }

      this.logger.log(`Sync txs for new incoming block nr. ${header.number}`);
      await this.getAndStoreTxsForBlock(header.number);
    });
  }

  /**
   * Get the txs for a given block and store them in DB
   * @param {number}  blockNumber
   */
  async getAndStoreTxsForBlock(blockNumber: number): Promise<void> {
    const blockData = await this.provider.eth.getBlock(blockNumber, true);

    // TODO: could implement a more sophisticated mechanism of populating transactions from past blocks,
    //  instead of just starting from the last block

    // TODO: could improve the storing of tx's in DB by doing a batch-insert
    for (const tx of blockData.transactions) {
      await this.create({
        hash: tx.hash,
        index: tx.transactionIndex,
        fromAddress: tx.from,
        toAddress: tx.to,
        value: tx.value,
        input: tx.input,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        gas: tx.gas,
        chain: this.getChainName(tx.chainId),
        gasPrice: tx.gasPrice,
        nonce: tx.nonce,
      });
    }
  }

  /**
   * The raw tx objects have chain IDs, which we map to certain name, for better readability
   * @param {string}  chainId
   * @return {CHAIN}
   */
  private getChainName(chainId: string): CHAIN {
    switch (chainId) {
      case '0x1':
        return CHAIN.ETHEREUM;
      default:
        return CHAIN.ETHEREUM;
    }
  }

  /**
   * Creates a new transaction record in the DB
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
   * Return the events for a given block, stored in the DB
   * @param {number}  block
   * @return  {Promise<TransactionEntity[]>}
   */
  async getTxsFromBlock(block: number): Promise<TransactionEntity[]> {
    this.logger.log(`Getting transactions for block ${block}`);
    return this.transactionEntity.find({ where: { blockNumber: block } });
  }
}

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { config } from '../config';
import { CHAIN, CHAIN_ID } from '../common/chain';
import { TransactionService } from '../transactions/transaction.service';

@Injectable()
export class Web3ProviderService {
  private readonly logger: Logger;
  private readonly provider;

  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly txService: TransactionService,
  ) {
    this.logger = new Logger(Web3ProviderService.name);
    this.provider = new Web3(new Web3.providers.WebsocketProvider(config().ethNode.wsUrl));

    this.initSync();
  }

  /**
   * Start transactions syncing and store parsed transactions into the DB
   */
  async initSync(): Promise<void> {
    this.logger.log('Initialize syncing of transactions');

    let maxBlockNumberInDB = await this.txService.getMaxBlockStored();
    const latestBlockNumber = await this.provider.eth.getBlockNumber();

    if (!maxBlockNumberInDB) {
      // NOTE: if there is no maxBlock from the DB, it means a clean startup on empty DB,
      // so for the current scope just sync from 100 blocks back
      maxBlockNumberInDB = latestBlockNumber - 100;
    }

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
      await this.txService.create({
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
      case CHAIN_ID.ETHEREUM:
        return CHAIN.ETHEREUM;
      case CHAIN_ID.POLYGON:
        return CHAIN.POLYGON;
      case CHAIN_ID.GOERLI:
        return CHAIN.GOERLI;
      case CHAIN_ID.MUMBAI:
        return CHAIN.MUMBAI;
      default:
        return null;
    }
  }
}

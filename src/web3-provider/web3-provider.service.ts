import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { config } from '../config';
import { CHAIN } from '../common/chain';
import { TransactionService } from '../transactions/transaction.service';

@Injectable()
export class Web3ProviderService {
  private readonly logger: Logger;
  private readonly providerEth;
  private readonly providerPolygon;

  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly txService: TransactionService,
  ) {
    this.logger = new Logger(Web3ProviderService.name);
    this.providerEth = new Web3(new Web3.providers.WebsocketProvider(config().ethNode.wsUrl));
    this.providerPolygon = new Web3(
      new Web3.providers.WebsocketProvider(config().polygonNode.wsUrl),
    );

    this.initSyncEth();
    this.initSyncPolygon();
  }

  private async initSyncEth(): Promise<void> {
    await this.initSync(CHAIN.ETHEREUM, this.providerEth);
  }

  private async initSyncPolygon(): Promise<void> {
    await this.initSync(CHAIN.POLYGON, this.providerPolygon);
  }

  /**
   * Start transactions syncing and store parsed transactions into the DB
   *
   * @param {CHAIN} chain
   * @param {any}   provider
   */
  private async initSync(chain: CHAIN, provider): Promise<void> {
    this.logger.log(`[${chain}] Initialize syncing of transactions for ${chain}`);

    let maxBlockNumberInDB = await this.txService.getMaxBlockStored(chain);
    const latestBlockNumber = await provider.eth.getBlockNumber();

    if (!maxBlockNumberInDB) {
      // NOTE: if there is no maxBlock from the DB, it means a clean startup on empty DB,
      // so for the current scope just sync from 100 blocks back
      maxBlockNumberInDB = latestBlockNumber - 100;
    }

    if (maxBlockNumberInDB < latestBlockNumber) {
      this.logger.log(
        `[${chain}] Sync past txs from block ${maxBlockNumberInDB} to latest block (${latestBlockNumber})`,
      );
      for (let blockNr = maxBlockNumberInDB + 1; blockNr <= latestBlockNumber; blockNr++) {
        await this.getAndStoreTxsForBlock(blockNr, chain, provider);
      }
      this.logger.log(`[${chain}] Syncing past txs done`);
    }

    provider.eth.subscribe('newBlockHeaders', async (err, header) => {
      if (err) {
        this.logger.error(`[${chain}] Could not sync block`, err);
      }

      this.logger.log(`[${chain}] Sync txs for new incoming block nr. ${header.number}`);
      await this.getAndStoreTxsForBlock(header.number, chain, provider);
    });
  }

  /**
   * Get the txs for a given block and store them in DB
   *
   * @param {number}  blockNumber
   * @param {CHAIN} chain
   * @param {any}   provider
   */
  private async getAndStoreTxsForBlock(blockNumber: number, chain: CHAIN, provider): Promise<void> {
    const blockData = await provider.eth.getBlock(blockNumber, true);

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
        chain,
        gasPrice: tx.gasPrice,
        nonce: tx.nonce,
      });
    }
  }
}

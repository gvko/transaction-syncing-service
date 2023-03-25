import { CHAIN } from '../../common/chain';

export class CreateTransactionInput {
  readonly hash: string;
  readonly index: number;
  readonly fromAddress: string;
  readonly toAddress: string;
  readonly value: string;
  readonly input: string;
  readonly blockNumber: number;
  readonly blockHash: string;
  readonly chain: CHAIN;
  readonly gas: number;
  readonly gasPrice: string;
  readonly nonce: number;
}

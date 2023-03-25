import { CHAIN } from '../common/chain';
import { TransactionEntity } from './transaction.entity';

export type TxsForAddressAndChainResult = {
  [key: string]: {
    [key in CHAIN]: TransactionEntity[];
  };
};

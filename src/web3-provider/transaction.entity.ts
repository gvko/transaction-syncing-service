import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CHAIN } from '../common/chain';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  hash: string;

  @Column({ type: 'integer', nullable: true })
  index?: number;

  @Column({ type: 'varchar', name: 'from_address' })
  fromAddress: string;

  @Column({ type: 'varchar', name: 'to_address', nullable: true })
  toAddress?: string;

  @Column('varchar')
  value: string;

  @Column('varchar')
  input: string;

  @Column({ type: 'integer', name: 'block_number', nullable: true })
  blockNumber?: number;

  @Column({ type: 'varchar', name: 'block_hash', nullable: true })
  blockHash?: string;

  @Column({
    type: 'enum',
    enum: [Object.values(CHAIN)],
    name: 'chain',
    nullable: true,
  })
  chain?: string;

  @Column('integer')
  gas: number;

  @Column({ type: 'varchar', name: 'gas_price' })
  gasPrice: string;

  @Column('integer')
  nonce: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}

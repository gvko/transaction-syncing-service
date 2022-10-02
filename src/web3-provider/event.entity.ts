import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('events')
export class EventEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', name: 'from_address' })
  fromAddress: string;

  @Field()
  @Column({ type: 'varchar', name: 'to_address' })
  toAddress: string;

  @Field()
  @Column('varchar')
  value: string;

  @Field()
  @Column('varchar')
  block: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}

import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn, Unique,
} from 'typeorm';

@ObjectType()
@Entity('users')
export class UserEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Field()
  @Column('date')
  dob: string;

  @Field()
  @Column({ type: 'varchar', name: 'wallet_address', length: 42, unique: true })
  walletAddress: string;
}

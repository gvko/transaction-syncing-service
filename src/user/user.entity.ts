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
@Entity('users')
export class UserEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column('varchar')
  lastName: string;

  @Field()
  @Column('date')
  dob: Date;

  @Field()
  @Column()
  walletAddress: string;
}

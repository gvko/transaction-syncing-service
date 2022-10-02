import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

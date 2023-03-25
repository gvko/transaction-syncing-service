import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737712000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create table "transactions" (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          hash VARCHAR,
          index INTEGER,
          from_address VARCHAR NOT NULL,
          to_address VARCHAR,
          value VARCHAR NOT NULL,
          input VARCHAR NOT NULL,
          block_number VARCHAR,
          block_hash VARCHAR,
          chain chain_type,
          gas INTEGER NOT NULL,
          gas_price VARCHAR NOT NULL,
          nonce INTEGER NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table "transactions"`);
  }

}

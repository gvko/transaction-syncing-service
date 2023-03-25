import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737702000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE chain_type AS ENUM ('ETHEREUM', 'POLYGON', 'GOERLI', 'SEPOLIA', 'MUMBAI');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop type "chain_type"`);
  }

}

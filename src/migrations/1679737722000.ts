import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737722000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE transactions ADD CONSTRAINT tx_hash_unique UNIQUE (hash);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE transactions DROP CONSTRAINT tx_hash_unique;`);
  }

}

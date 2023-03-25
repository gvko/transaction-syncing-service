import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1664714406600 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create table "events" (
        "id" uuid not null default uuid_generate_v4(),
        "from_address" varchar(255) not null,
        "to_address" varchar(255) not null,
        "value" varchar(255) not null,
        "block" varchar(255) not null,
        "created_at" timestamptz(0) not null default now(),
        "updated_at" timestamptz(0) not null default now()
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table "events"`);
  }

}

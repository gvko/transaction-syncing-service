import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1664648788315 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create table "users" (
        "id" uuid not null default uuid_generate_v4(),
        "name" varchar(255) not null,
        "last_name" varchar(255) null,
        "wallet_address" varchar(255) not null,
        "created_at" timestamptz(0) not null default now(),
        "updated_at" timestamptz(0) not null default now()
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table "users"`);
  }

}

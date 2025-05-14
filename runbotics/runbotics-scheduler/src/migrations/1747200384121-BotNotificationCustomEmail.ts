import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1747200384121 implements MigrationInterface {
    name = 'Migrations1747200384121';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "notification_bot" DROP CONSTRAINT "UQ_05d078e13878fa287d55aa23b74"');
        await queryRunner.query('ALTER TABLE "notification_bot" ADD "email" character varying(256) NOT NULL DEFAULT \'\'');
        await queryRunner.query('ALTER TABLE "notification_bot" ADD CONSTRAINT "UQ_a9f3eee9f6a2453f091f954bb04" UNIQUE ("email", "user_id", "bot_id", "type")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "notification_bot" DROP CONSTRAINT "UQ_a9f3eee9f6a2453f091f954bb04"');
        await queryRunner.query('ALTER TABLE "notification_bot" DROP COLUMN "email"');
        await queryRunner.query('ALTER TABLE "notification_bot" ADD CONSTRAINT "UQ_05d078e13878fa287d55aa23b74" UNIQUE ("user_id", "bot_id", "type")');
    }

}

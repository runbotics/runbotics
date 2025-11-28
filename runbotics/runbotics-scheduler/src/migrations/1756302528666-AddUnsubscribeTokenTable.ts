import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUnsubscribeTokenTable1756302528666 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "unsubscribe_token" (
                "id" SERIAL NOT NULL PRIMARY KEY,
                "email" varchar(255) NOT NULL UNIQUE,
                "token" varchar(64) NOT NULL UNIQUE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "unsubscribe_token"');
    }

}

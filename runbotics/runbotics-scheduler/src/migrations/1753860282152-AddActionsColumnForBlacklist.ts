import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActionsColumnForBlacklist1753860282152 implements MigrationInterface {
    name = 'AddActionsColumnForBlacklist1753860282152';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."action_blacklist"
            ADD "actionIds" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduler"."action_blacklist"
            DROP COLUMN "actionIds"`);
    }

}

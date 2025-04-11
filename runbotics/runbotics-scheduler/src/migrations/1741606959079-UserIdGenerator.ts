import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdGenerator1741606959079 implements MigrationInterface {
    name = 'UserIdGenerator1741606959079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "id" SET DEFAULT nextval('sequence_generator')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "id" DROP DEFAULT`);
    }

}

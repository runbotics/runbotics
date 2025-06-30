import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAddMsUserId1751275041677 implements MigrationInterface {
    name = 'UserAddMsUserId1751275041677';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "jhi_user" ADD "microsoft_user_id" character varying(256)');
        await queryRunner.query('ALTER TABLE "jhi_user" ADD CONSTRAINT "UQ_a73621fd04a42c74d3ddbe89081" UNIQUE ("microsoft_tenant_id", "microsoft_user_id")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "jhi_user" DROP CONSTRAINT "UQ_a73621fd04a42c74d3ddbe89081"');
        await queryRunner.query('ALTER TABLE "jhi_user" DROP COLUMN "microsoft_user_id"');
    }

}

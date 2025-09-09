import { User } from "#/scheduler-database/user/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UserHasBeenActivated1738100152257 implements MigrationInterface {
    name = 'UserHasBeenActivated1738100152257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "jhi_user" ADD "has_been_activated" boolean NOT NULL DEFAULT false`
        );

        await queryRunner.query(
            'UPDATE "jhi_user" SET has_been_activated=true'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "jhi_user" DROP COLUMN "has_been_activated"`
        );
    }
}

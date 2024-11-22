import { MigrationInterface, QueryRunner } from "typeorm";

export class Guests1732182583076 implements MigrationInterface {
    name = 'Guests1732182583076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "fk_guest_user_id"`);
        await queryRunner.query(`ALTER TABLE "guest" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_6e15557f006bedc89949a47c64d" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_6e15557f006bedc89949a47c64d"`);
        await queryRunner.query(`ALTER TABLE "guest" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "fk_guest_user_id" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

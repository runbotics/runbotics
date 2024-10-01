import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1727766766265 implements MigrationInterface {
    name = 'Users1727766766265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "fk_jhi_user_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "ux_user_login"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "FK_a4e5405474004354ba528a2a618"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "FK_f7f60cbffa00fac43994c8579a2"`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" DROP CONSTRAINT "FK_f110dd27f6b2da20b3f90cff632"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "FK_f1b3fb6941411a5555f74566021"`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "FK_e88c501605e0063783ee80b7b0e"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "FK_6746de11785f498c55e7d6959f3"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_bdd0d73c04229928006483fd445"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "jhi_user_id_seq" OWNED BY "jhi_user"."id"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "id" SET DEFAULT nextval('"jhi_user_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" DROP CONSTRAINT "ux_user_email"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" SET DEFAULT 'en'`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "tenant_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "FK_a4e5405474004354ba528a2a618" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "FK_f7f60cbffa00fac43994c8579a2" FOREIGN KEY ("creator_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "FK_f1b3fb6941411a5555f74566021" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_bdd0d73c04229928006483fd445" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "FK_6746de11785f498c55e7d6959f3" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" ADD CONSTRAINT "FK_f110dd27f6b2da20b3f90cff632" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "FK_e88c501605e0063783ee80b7b0e" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bot_collection_user" DROP CONSTRAINT "FK_e88c501605e0063783ee80b7b0e"`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" DROP CONSTRAINT "FK_f110dd27f6b2da20b3f90cff632"`);
        await queryRunner.query(`ALTER TABLE "notification_bot" DROP CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "FK_6746de11785f498c55e7d6959f3"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" DROP CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_bdd0d73c04229928006483fd445"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" DROP CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" DROP CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b"`);
        await queryRunner.query(`ALTER TABLE "schedule_process" DROP CONSTRAINT "FK_f1b3fb6941411a5555f74566021"`);
        await queryRunner.query(`ALTER TABLE "notification_process" DROP CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "FK_f7f60cbffa00fac43994c8579a2"`);
        await queryRunner.query(`ALTER TABLE "global_variable" DROP CONSTRAINT "FK_a4e5405474004354ba528a2a618"`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "last_modified_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "created_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "tenant_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "lang_key" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "ux_user_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "jhi_user_id_seq"`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_c7f06ea7b501efdd1a442d7f7e6" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential" ADD CONSTRAINT "FK_5f3dcfecb65a28b3657345507a2" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection_user" ADD CONSTRAINT "FK_14c0e239df3748b2a116b22ba9b" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_bdd0d73c04229928006483fd445" FOREIGN KEY ("updated_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduler"."credential_collection" ADD CONSTRAINT "FK_904fa54de57a33b4bedeb54ff9e" FOREIGN KEY ("created_by_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_process" ADD CONSTRAINT "FK_e1a2280a824e267cdb588c74bd9" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_bot" ADD CONSTRAINT "FK_63e8bb25d071a7bbd6b80b2503a" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "FK_6746de11785f498c55e7d6959f3" FOREIGN KEY ("created_by") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bot_collection_user" ADD CONSTRAINT "FK_e88c501605e0063783ee80b7b0e" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "schedule_process" ADD CONSTRAINT "FK_f1b3fb6941411a5555f74566021" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jhi_user_authority" ADD CONSTRAINT "FK_f110dd27f6b2da20b3f90cff632" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "FK_f7f60cbffa00fac43994c8579a2" FOREIGN KEY ("creator_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "global_variable" ADD CONSTRAINT "FK_a4e5405474004354ba528a2a618" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD "login" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "ux_user_login" UNIQUE ("login")`);
        await queryRunner.query(`ALTER TABLE "jhi_user" ADD CONSTRAINT "fk_jhi_user_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

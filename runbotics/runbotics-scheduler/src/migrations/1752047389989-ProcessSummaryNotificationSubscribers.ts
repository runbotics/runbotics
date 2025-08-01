import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessSummaryNotificationSubscribers1752047389989 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "process_summary_notification_subscribers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" BIGINT NOT NULL,
                "custom_email" character varying(256),
                "process_id" BIGINT NOT NULL,
                CONSTRAINT "UQ_custom_email_user_process" UNIQUE ("custom_email", "user_id", "process_id"),
                CONSTRAINT "PK_notification_process" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "process_summary_notification_subscribers"
            ADD CONSTRAINT "FK_notification_user" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "process_summary_notification_subscribers"
            ADD CONSTRAINT "FK_notification_process" FOREIGN KEY ("process_id") REFERENCES "process"("id") ON DELETE CASCADE
        `);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "process_summary_notification_subscribers"');
    }

}
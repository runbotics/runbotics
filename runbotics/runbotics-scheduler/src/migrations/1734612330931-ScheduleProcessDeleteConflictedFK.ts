import { MigrationInterface, QueryRunner } from 'typeorm';

export class ScheduleProcessDeleteConflictedFK1734612330931 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [result] = await queryRunner.query(`
            SELECT count(constraint_name)
            FROM information_schema.table_constraints AS tc
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.constraint_name = 'FKrtw1gbnb035raau8lvtt6u3jf'
            AND tc.table_name='schedule_process';
        `);

        if (result.count === '1') {
            await queryRunner.query('ALTER TABLE "schedule_process" DROP CONSTRAINT "FKrtw1gbnb035raau8lvtt6u3jf"');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}

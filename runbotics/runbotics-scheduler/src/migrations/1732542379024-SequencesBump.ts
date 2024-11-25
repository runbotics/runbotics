import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

interface CountResult { count: string; }
type MaxResult = { max: string; } | null;

export class SequencesBump1732542379024 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Process sequence --------------
        await queryRunner.query(`
            SELECT COUNT(*) as count
            FROM pg_class
            WHERE relname = 'process_id_seq';
        `).then((data: CountResult[]) => {
            if (!data.length || !data[0].count)
                throw new Error('Cannot find sequence for process id');
        });

        // Find max
        const maxProcessId = await queryRunner.manager
            .createQueryBuilder()
            .select('MAX(p.id)', 'max')
            .from(ProcessEntity, 'p')
            .getRawOne<MaxResult>()
            .then((res) => {
                if (res === null || res.max === '0')
                    throw new Error('Wrong max process id');

                return +res.max;
            });
        // Reset sequence
        await queryRunner.query(`
            ALTER SEQUENCE process_id_seq RESTART WITH ${maxProcessId + 1};
        `);


        // Tag sequence --------------
        await queryRunner.query(`
            SELECT COUNT(*) as count
            FROM pg_class
            WHERE relname = 'tag_id_seq';
        `).then((data: CountResult[]) => {
            if (!data.length || !data[0].count)
                throw new Error('Cannot find sequence for tag id');
        });

        // Find max
        const maxTagId = await queryRunner.manager
            .createQueryBuilder()
            .select('MAX(t.id)', 'max')
            .from(Tag, 't')
            .getRawOne<MaxResult>()
            .then((res) => {
                if (res === null || res.max === '0')
                    throw new Error('Wrong max tag id');

                return +res.max;
            });
        // Reset sequence
        await queryRunner.query(`
            ALTER SEQUENCE tag_id_seq RESTART WITH ${maxTagId + 1};
        `);


        // Global variable sequence --------------
        await queryRunner.query(`
            SELECT COUNT(*) as count
            FROM pg_class
            WHERE relname = 'global_variable_id_seq';
        `).then((data: CountResult[]) => {
            if (!data.length || !data[0].count)
                throw new Error('Cannot find sequence for global variable id');
        });

        // Find max
        const maxGlobalVariableId = await queryRunner.manager
            .createQueryBuilder()
            .select('MAX(g.id)', 'max')
            .from(GlobalVariable, 'g')
            .getRawOne<MaxResult>()
            .then((res) => {
                if (res === null || res.max === '0')
                    throw new Error('Wrong max global variable id');

                return +res.max;
            });
        // Reset sequence
        await queryRunner.query(`
            ALTER SEQUENCE global_variable_id_seq RESTART WITH ${maxGlobalVariableId + 1};
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

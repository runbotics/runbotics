import { MigrationInterface, QueryRunner } from 'typeorm';

export class OldLogsManagement1733815803333 implements MigrationInterface {
    name = 'OldLogsManagement1733815803333';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE PROCEDURE public.remove_old_process_instance(batch_limit integer DEFAULT 1, cutoff_date date DEFAULT (CURRENT_DATE - '6 months'::interval))
            LANGUAGE plpgsql
            AS $procedure$
            DECLARE
                rows_deleted INT;
                rows_left INT;
                half_year_back DATE;
            BEGIN
                half_year_back := CURRENT_DATE - INTERVAL '6 months';

                IF cutoff_date > CURRENT_DATE - INTERVAL '1 months' THEN
                    RAISE EXCEPTION 'cutoff_date must be at least 1 months before the current date: %', cutoff_date;
                END IF;

                RAISE NOTICE 'Starting deletion of records older than %.', cutoff_date;
                RAISE NOTICE 'Omitting those processes that have less than 10 runs since % (last 6 months).', half_year_back;

                LOOP
                    BEGIN
                    DELETE FROM process_instance
                    WHERE id IN (
                        SELECT id
                        FROM process_instance
                        WHERE created < cutoff_date
                            AND process_id IN (
                                SELECT process_id
                                FROM process_instance
                                WHERE created > half_year_back
                                GROUP BY process_id
                                HAVING COUNT(id) > 10
                            )
                        LIMIT batch_limit
                    );

                    GET DIAGNOSTICS rows_deleted = ROW_COUNT;

                    RAISE NOTICE 'Deleted % rows in this batch.', rows_deleted;

                    COMMIT;

                    EXIT WHEN rows_deleted = 0;

                    SELECT COUNT(*) INTO rows_left
                    FROM process_instance
                    WHERE created < cutoff_date;

                    RAISE NOTICE 'Remaining rows to delete (roughly): %', rows_left;
                    END;
                END LOOP;

                RAISE NOTICE 'Deletion process completed.';
            END;
            $procedure$
        `);

        await queryRunner.query(`
            CREATE OR REPLACE PROCEDURE public.remove_old_records(target_table text, batch_limit integer DEFAULT 1, cutoff_date date DEFAULT (CURRENT_DATE - '12 mons'::interval))
            LANGUAGE plpgsql
            AS $procedure$
            DECLARE
                rows_deleted INT;
                rows_left INT;
                query TEXT;
            BEGIN
                IF target_table NOT IN ('process_instance', 'process_instance_event', 'process_instance_loop_event') THEN
                    RAISE EXCEPTION 'Invalid table name: %. Allowed tables are: process_instance, process_instance_event, process_instance_loop_event.', target_table;
                END IF;

                IF cutoff_date > current_date - INTERVAL '3 months' THEN
                    RAISE EXCEPTION 'cutoff_date % is less than 3 months ago. It must be at least 3 months before the current date.', cutoff_date;
                END IF;

                RAISE NOTICE 'Cutoff date is %.', cutoff_date;

                LOOP
                    BEGIN
                        query := format(
                            'WITH to_delete AS (
                                SELECT id
                                FROM %I
                                WHERE created < $1
                                LIMIT $2
                            )
                            DELETE FROM %I
                            WHERE id IN (SELECT id FROM to_delete);',
                            target_table, target_table
                        );

                        EXECUTE query USING cutoff_date, batch_limit;

                        GET DIAGNOSTICS rows_deleted = ROW_COUNT;

                        RAISE NOTICE 'Deleted % rows in this batch.', rows_deleted;

                        EXIT WHEN rows_deleted = 0;

                        COMMIT;

                    END;

                    query := format(
                        'SELECT COUNT(*) FROM %I WHERE created < $1',
                        target_table
                    );

                    EXECUTE query INTO rows_left USING cutoff_date;

                    RAISE NOTICE 'There are % rows left to delete.', rows_left;
                END LOOP;

                RAISE NOTICE 'Deletion process completed.';
            END;
            $procedure$
            `);

        await queryRunner.query(`
            CREATE VIEW table_size_info
            AS
            ( SELECT pg_statio_user_tables.schemaname AS schema_name,
                pg_statio_user_tables.relname AS table_name,
                pg_size_pretty(pg_total_relation_size((pg_statio_user_tables.relid)::regclass)) AS total_size,
                pg_size_pretty(pg_table_size((pg_statio_user_tables.relid)::regclass)) AS table_size,
                pg_size_pretty(pg_indexes_size((pg_statio_user_tables.relid)::regclass)) AS indexes_size
            FROM pg_statio_user_tables
            ORDER BY (pg_total_relation_size((pg_statio_user_tables.relid)::regclass)) DESC)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP VIEW IF EXISTS table_size_info;
        `);

        await queryRunner.query(`
            DROP PROCEDURE IF EXISTS remove_old_process_instance;
        `);

        await queryRunner.query(`
            DROP PROCEDURE IF EXISTS remove_old_records;
        `);
    }
}

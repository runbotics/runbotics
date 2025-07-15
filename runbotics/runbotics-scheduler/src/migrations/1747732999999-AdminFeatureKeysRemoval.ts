import { MigrationInterface, QueryRunner } from 'typeorm';

const FEATURE_KEYS = [
    'ALL_PROCESSES_READ',
    'CREDENTIALS_PAGE_READ',
    'EXTERNAL_ACTION_ADD',
    'EXTERNAL_ACTION_DELETE',
    'EXTERNAL_ACTION_EDIT',
    'EXTERNAL_ACTION_READ',
    'GLOBAL_VARIABLE_ADD',
    'GLOBAL_VARIABLE_DELETE',
    'GLOBAL_VARIABLE_EDIT',
    'GLOBAL_VARIABLE_READ',
    'PROCESS_ACTIONS_LIST',
    'PROCESS_ACTIONS_LIST_ADVANCED',
    'PROCESS_ADD',
    'PROCESS_ALL_ACCESS',
    'PROCESS_BOT_COLLECTION_EDIT',
    'PROCESS_BOT_COLLECTION_READ',
    'PROCESS_BOT_SYSTEM_EDIT',
    'PROCESS_BOT_SYSTEM_READ',
    'PROCESS_BUILD_VIEW',
    'PROCESS_COLLECTION_ADD',
    'PROCESS_COLLECTION_ALL_ACCESS',
    'PROCESS_COLLECTION_DELETE',
    'PROCESS_COLLECTION_EDIT',
    'PROCESS_COLLECTION_READ',
    'PROCESS_CONFIGURE_VIEW',
    'PROCESS_DELETE',
    'PROCESS_EDIT_INFO',
    'PROCESS_EDIT_STRUCTURE',
    'PROCESS_INSTANCE_EVENT_READ',
    'PROCESS_INSTANCE_HISTORY_DETAIL_VIEW',
    'PROCESS_INSTANCE_HISTORY_READ',
    'PROCESS_INSTANCE_READ',
    'PROCESS_INSTANCE_TERMINATE',
    'PROCESS_IS_ATTENDED_EDIT',
    'PROCESS_IS_ATTENDED_READ',
    'PROCESS_IS_TRIGGERABLE_EDIT',
    'PROCESS_IS_TRIGGERABLE_EXECUTE',
    'PROCESS_IS_TRIGGERABLE_READ',
    'PROCESS_LIST_DETAIL_VIEW',
    'PROCESS_LIST_READ',
    'PROCESS_LIST_TABLE_VIEW',
    'PROCESS_OUTPUT_TYPE_EDIT',
    'PROCESS_OUTPUT_TYPE_READ',
    'PROCESS_READ',
    'PROCESS_RUN_VIEW',
    'PROCESS_START',
    'PROCESS_TEMPLATES_LIST',
    'SCHEDULE_ADD',
    'SCHEDULE_DELETE',
    'SCHEDULE_READ',
    'SCHEDULER_JOBS_DELETE',
    'SCHEDULER_JOBS_READ',
    'SCHEDULER_PAGE_READ',
    'TAG_READ'
];

export class AdminFeatureKeysRemoval1747732999999 implements MigrationInterface {
    name = 'AdminFeatureKeysRemoval1747732999999';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "authority_feature_key"
            WHERE "authority" = 'ROLE_ADMIN' AND "feature_key" IN (${FEATURE_KEYS.map(key => `'${key}'`).join(', ')})
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "authority_feature_key" ("authority", "feature_key")
            VALUES ${FEATURE_KEYS.map(key => `('ROLE_ADMIN', '${key}')`).join(', ')}`);
    }
}

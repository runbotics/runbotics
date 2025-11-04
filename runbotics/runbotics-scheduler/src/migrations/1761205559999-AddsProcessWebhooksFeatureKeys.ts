import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsProcessWebhooksFeatureKeys1761205559999 implements MigrationInterface {

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO public."feature_key" (name)
                VALUES ('PROCESS_WEBHOOKS_VIEW'),
                       ('PROCESS_WEBHOOKS_EDIT')
            `
        );
        await queryRunner.query(`
            INSERT INTO public.authority_feature_key (authority, feature_key)
            VALUES ('ROLE_TENANT_ADMIN', 'PROCESS_WEBHOOKS_VIEW'),
                   ('ROLE_TENANT_ADMIN', 'PROCESS_WEBHOOKS_EDIT'),
                   ('ROLE_RPA_USER', 'PROCESS_WEBHOOKS_VIEW'),
                   ('ROLE_RPA_USER', 'PROCESS_WEBHOOKS_EDIT')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.authority_feature_key
            WHERE feature_key IN ('PROCESS_WEBHOOKS_VIEW', 'PROCESS_WEBHOOKS_EDIT')
            AND authority IN ('ROLE_TENANT_ADMIN', 'ROLE_RPA_USER')
        `);

        await queryRunner.query(`
            DELETE FROM public."feature_key"
            WHERE name IN ('PROCESS_WEBHOOKS_VIEW', 'PROCESS_WEBHOOKS_EDIT')
        `);
    }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignAiAccessAndCompanyGuideToCompanyAccounts1760344035273
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.user_feature_key (user_id, feature_key)
            SELECT id, 'AI_ASSISTANTS_ACCESS'
            FROM public.jhi_user u 
            JOIN public.jhi_user_authority ua ON u.id = ua.user_id 
            LEFT JOIN public.user_feature_key ufk ON u.id = ufk.user_id
            WHERE u.email LIKE '%@all-for-one.com' 
                AND ua.authority_name != 'ROLE_USER' 
                AND u.id NOT IN (
                    SELECT user_id 
                    FROM public.user_feature_key 
                    WHERE feature_key = 'AI_ASSISTANTS_ACCESS'
            );
        `);

        await queryRunner.query(`
            INSERT INTO public.user_feature_key (user_id, feature_key)
            SELECT DISTINCT u.id, 'AI_ASSISTANT_COMPANY_GUIDE'
            FROM public.jhi_user u 
            JOIN public.jhi_user_authority ua ON u.id = ua.user_id 
            WHERE u.email LIKE '%@all-for-one.com' 
                AND NOT EXISTS (
                    SELECT 1 
                    FROM public.user_feature_key ufk 
                    WHERE ufk.user_id = u.id 
                    AND ufk.feature_key = 'AI_ASSISTANT_COMPANY_GUIDE'        
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.user_feature_key 
            WHERE feature_key = 'AI_ASSISTANT_COMPANY_GUIDE' 
                AND user_id IN (
                    SELECT DISTINCT u.id
                    FROM public.jhi_user u 
                    WHERE u.email LIKE '%@all-for-one.com'
                );
    `);
        await queryRunner.query(`
            DELETE FROM public.user_feature_key 
            WHERE feature_key = 'AI_ASSISTANTS_ACCESS' 
                AND user_id IN (
                    SELECT DISTINCT u.id
                    FROM public.jhi_user u 
                    JOIN public.jhi_user_authority ua ON u.id = ua.user_id 
                    WHERE u.email LIKE '%@all-for-one.com' 
                        AND ua.authority_name != 'ROLE_USER'
                );
    `);
    }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSubscriptionEndColumnName1755156248264 implements MigrationInterface {
    name = 'FixSubscriptionEndColumnName1755156248264';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const result = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'tenant' 
            AND column_name = 'subscriptionEnd'
        `);
        
        if (result.length > 0) {
            await queryRunner.query('ALTER TABLE "public"."tenant" RENAME COLUMN "subscriptionEnd" TO "subscription_end"');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const result = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'tenant' 
            AND column_name = 'subscription_end'
        `);
        
        if (result.length > 0) {
            await queryRunner.query('ALTER TABLE "public"."tenant" RENAME COLUMN "subscription_end" TO "subscriptionEnd"');
        }
    }
}
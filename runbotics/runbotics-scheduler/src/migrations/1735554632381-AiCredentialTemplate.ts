import { CredentialTemplate } from '#/scheduler-database/credential-template/credential-template.entity';
import { ActionCredentialType } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AiCredentialTemplate1735554632381 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(CredentialTemplate, [{
            name: ActionCredentialType.AI,
            attributes: [
                {
                    name: 'apiKey',
                    description: 'API key to authenticate to OpenAI'
                }
            ]
        }]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(CredentialTemplate, { name: ActionCredentialType.AI });
    }
}

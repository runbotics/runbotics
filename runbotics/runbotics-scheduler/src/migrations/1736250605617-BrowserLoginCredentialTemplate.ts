import { CredentialTemplate } from '#/scheduler-database/credential-template/credential-template.entity';
import { ActionCredentialType } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class BrowserLoginCredentialTemplate1736250605617
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(CredentialTemplate, [{
            name: ActionCredentialType.BROWSER_LOGIN,
            attributes: [
                {
                    name: 'login',
                    description: 'Username'
                },
                {
                    name: 'password',
                    description: 'Account password'
                }
            ]
        }]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(CredentialTemplate, { name: ActionCredentialType.BROWSER_LOGIN });
    }
}

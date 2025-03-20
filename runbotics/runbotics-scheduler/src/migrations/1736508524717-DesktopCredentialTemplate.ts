import { CredentialTemplate } from '#/scheduler-database/credential-template/credential-template.entity';
import { ActionCredentialType } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesktopCredentialTemplate1736508524717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);
        const desktopTemplate = await credentialTemplateRepo.findOneBy({ name: ActionCredentialType.DESKTOP });
        if (desktopTemplate) {
            throw new Error(`Template name (${ActionCredentialType.DESKTOP}) already exists`);
        }

        await credentialTemplateRepo.save([{
            name: ActionCredentialType.DESKTOP,
            attributes: [
                {
                    name: 'username',
                    description: ''
                },
                {
                    name: 'password',
                    description: ''
                },
            ]
        }]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);
        const desktopTemplate = await credentialTemplateRepo.findOneByOrFail({ name: ActionCredentialType.DESKTOP });

        await credentialTemplateRepo.remove(desktopTemplate);
    }
}

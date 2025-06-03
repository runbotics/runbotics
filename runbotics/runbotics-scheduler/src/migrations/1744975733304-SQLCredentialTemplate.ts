import { CredentialTemplate } from "#/scheduler-database/credential-template/credential-template.entity";
import { ActionCredentialType } from "runbotics-common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SQLCredentialTemplate1744975733304 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);
        const desktopTemplate = await credentialTemplateRepo.findOneBy({ name: ActionCredentialType.SQL });
        if (desktopTemplate) {
            throw new Error(`Template name (${ActionCredentialType.SQL}) already exists`);
        }

        await credentialTemplateRepo.save([{
            name: ActionCredentialType.SQL,
            attributes: [
                {
                    name: 'url',
                    description: 'Connection URL to database; It should include user, password and database to use',
                }
            ]
        }]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const credentialTemplateRepo = queryRunner.manager.getRepository(CredentialTemplate);
        const desktopTemplate = await credentialTemplateRepo.findOneByOrFail({ name: ActionCredentialType.SQL });

        await credentialTemplateRepo.remove(desktopTemplate);
    }

}


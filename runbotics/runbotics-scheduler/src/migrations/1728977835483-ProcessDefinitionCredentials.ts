import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { Logger } from '#/utils/logger/logger';
import { ACTION_GROUP, ActionCredentialType } from 'runbotics-common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessDefinitionCredentials1728977835483 implements MigrationInterface {
    private readonly logger = new Logger(ProcessDefinitionCredentials1728977835483.name);
    private readonly CREDENTIAL_ACTION_IDS = [
        ACTION_GROUP.ASANA,
        ACTION_GROUP.GOOGLE,
        ACTION_GROUP.JIRA,
        ACTION_GROUP.JIRA_CLOUD,
        ACTION_GROUP.JIRA_SERVER,
        ACTION_GROUP.SAP,
        ACTION_GROUP.MAIL,
        ACTION_GROUP.BEEOFFICE,
        ACTION_GROUP.CLOUD_EXCEL,
        ACTION_GROUP.CLOUD_FILE,
    ];
    private readonly ACTION_ID_TO_CREDENTIAL_TYPE = {
        [ACTION_GROUP.ASANA]: ActionCredentialType.ASANA,
        [ACTION_GROUP.GOOGLE]: ActionCredentialType.GOOGLE,
        [ACTION_GROUP.JIRA]: ActionCredentialType.ATLASSIAN,
        [ACTION_GROUP.JIRA_CLOUD]: ActionCredentialType.ATLASSIAN,
        [ACTION_GROUP.JIRA_SERVER]: ActionCredentialType.ATLASSIAN,
        [ACTION_GROUP.SAP]: ActionCredentialType.SAP,
        [ACTION_GROUP.MAIL]: ActionCredentialType.EMAIL,
        [ACTION_GROUP.BEEOFFICE]: ActionCredentialType.BEE_OFFICE,
        [ACTION_GROUP.CLOUD_EXCEL]: ActionCredentialType.MICROSOFT_GRAPH,
        [ACTION_GROUP.CLOUD_FILE]: ActionCredentialType.MICROSOFT_GRAPH,
    };

    private getCredentialTypeFromActionGroup(actionId: string) {
        if (!this.ACTION_ID_TO_CREDENTIAL_TYPE[actionId]) {
            throw new Error(`No credential type found for actionId: ${actionId}`);
        }
        return this.ACTION_ID_TO_CREDENTIAL_TYPE[actionId];
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        const processes = await queryRunner.manager.getRepository(ProcessEntity).find();

        const customCredentialProcesses = processes.map(process => {
            const result = this.addCustomCredentialId(process.definition, this.CREDENTIAL_ACTION_IDS);
            return {
                ...process,
                definition: result,
            };
        });

        await queryRunner.manager.save(ProcessEntity, customCredentialProcesses);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const customCredentialProcesses = await queryRunner.manager.getRepository(ProcessEntity).find();

        const noCustomCredentialProcesses = customCredentialProcesses.map(process => {
            const noCustomCredentialDefinition = process.definition.replace(/camunda:customCredentialId="undefined"/g, '');
            const noActionTypeDefinition = noCustomCredentialDefinition.replace(/camunda:credentialType="[^"]+"/g, '');
            return {
                ...process,
                definition: noActionTypeDefinition,
            };
        });

        await queryRunner.manager.save(ProcessEntity, noCustomCredentialProcesses);
    }

    private addCustomCredentialId(definition: string, actionGroups: string[]): string {
        const regex = /actionId="([^"]+)"/g;

        return definition.replace(regex, (match, actionId) => {
            const actionGroup = actionId.split('.').at(0);

            if (actionGroups.includes(actionGroup)) {
                return `${match} camunda:credentialType="${this.getCredentialTypeFromActionGroup(actionGroup)}"`;
            }

            return match;
        });
    }
}

import { CredentialTemplate } from '#/scheduler-database/credential-template/credential-template.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ActionCredentialType } from 'runbotics-common';
import { CredentialTemplateAttribute } from '#/scheduler-database/credential-template-attribute/credential-template-attribute.entity';

const TEMPLATES = [
    {
        name: ActionCredentialType.ASANA,
    },
    {
        name: ActionCredentialType.ATLASSIAN,
        description: 'Among others for Jira Server and Jira Cloud actions',
        attributes: [
            {
                name: 'usernameEnv',
                description: 'Username of the account to use for the action', // @todo what with polish translations? how about using this name as translation key?
            },
            {
                name: 'passwordEnv',
                description: 'Password of the account to use for the action',
            },
            {
                name: 'originEnv',
                description: 'URL of the Jira instance to connect to',
            }
        ],
    },
    {
        name: ActionCredentialType.BEE_OFFICE,
        attributes: [
            {
                name: 'username'
            },
            {
                name: 'password'
            },
            {
                name: 'logsys',
                description: 'Organization name - on login page an input right below password field, e.g. "my-company"',
            },
            {
                name: 'url',
                description: 'URL to the BeeOffice instance',
            },
        ],
    },
    {
        name: ActionCredentialType.GOOGLE,
        attributes: [
            {
                name: 'refreshToken',
                description: 'Refresh token for Google API',
            },
            {
                name: 'authCode',
                description: 'Authorization code for Google API',
            },
        ],
    },
    {
        name: ActionCredentialType.MICROSOFT_GRAPH,
        description: 'Among others for Excel, OneDrive (Cloud File), SharePoint actions',
        attributes: [
            {
                name: 'clientId',
            },
            {
                name: 'tenantId',
            },
            {
                name: 'clientSecret',
            },
            {
                name: 'username',
            },
            {
                name: 'password',
            },
        ],
    },
    {
        name: ActionCredentialType.SAP,
        attributes: [
            {
                name: 'user',
            },
            {
                name: 'password',
            },
        ],
    },
    {
        name: ActionCredentialType.EMAIL,
        attributes: [
            {
                name: 'mailHost',
            },
            {
                name: 'mailPort',
            },
            {
                name: 'mailUsername',
            },
            {
                name: 'mailPassword',
            },
        ],
    }
];

export class CredentialTemplates1723801171165 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(CredentialTemplate, TEMPLATES);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(CredentialTemplate, { name: TEMPLATES.map(t => t.name) });
    }
}

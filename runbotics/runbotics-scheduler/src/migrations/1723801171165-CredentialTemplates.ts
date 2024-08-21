import { CredentialTemplate } from '#/scheduler-database/credential-template/credential-template.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ActionCredentialType } from 'runbotics-common';

const TEMPLATES = [
    {
        name: ActionCredentialType.ASANA,
    },
    {
        name: ActionCredentialType.ATLASSIAN,
        description: 'Among others for Jira Server and Jira Cloud actions',
        attributes: [
            {
                name: 'usernameEnv', // @todo do we keep 'Env' in the name?
                description: 'Username of the account to use for the action', // @todo what with polish translations? maybe another value - translateKeyCode? -> or lets use this name as translation key! - because english names should start with capital letter too!
            },
            {
                name: 'passwordEnv',
                description: 'Password of the account to use for the action',
            },
            {
                name: 'originEnv', // @todo origin or url/instance?
                description: 'URL of the Jira instance to connect to',
            }
            // @todo anything else?
            // [jiraCloud.getUserWorklogs] Running desktop script {
            //     script: 'jiraCloud.getUserWorklogs',
            //     mode: 'date',
            //     originEnv: 'origin-environment-variableeee',
            //     usernameEnv: 'username-environment-variableee',
            //     passwordEnv: 'password-env--varrrrrr',
            //     email: 'emaillll',
            //     date: 'dateeeeee'
            // }
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
                description: '', // @todo fill
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
        await queryRunner.manager.delete(CredentialTemplate, TEMPLATES);
    }
}

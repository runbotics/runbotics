import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { version } from '../../package.json';
import { decrypt } from '#utils/decryptor';
import { ArgumentsService } from './arguments.service';
import { RunboticsLogger } from '#logger';

enum flagNames {
    USERNAME = 'u',
    PASSWORD = 'p',
}

export interface MicrosoftAuth {
    tenantId: string | undefined;
    clientId: string | undefined;
    clientSecret: string | undefined;
    username: string | undefined;
    password: string | undefined;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface GoogleAuth {
    privateKey: string | undefined;
    serviceAccountEmail: string | undefined;
}

@Injectable()
export class ServerConfigService {
    private readonly runboticsLogger = new RunboticsLogger(ServerConfigService.name);

    constructor(
        private configService: ConfigService,
        private argumentsService: ArgumentsService,
    ) {}

    get extensionsDirPath(): string {
        return this.getEnvValue('RUNBOTICS_EXTENSION_DIR');
    }

    get entrypointUrl(): string {
        return this.getEnvValue('RUNBOTICS_ENTRYPOINT_URL');
    }

    get entrypointSchedulerUrl(): string {
        return this.getEnvValue('RUNBOTICS_SCHEDULER_ENTRYPOINT_URL');
    }

    get installationId(): string {
        return this.getEnvValue('RUNBOTICS_INSTALLATION_ID');
    }

    get credentials(): Credentials {
        const username = this.argumentsService.getFlagValue(flagNames.USERNAME) || this.getEnvValue('RUNBOTICS_USERNAME');
        const password = this.argumentsService.getFlagValue(flagNames.PASSWORD) || this.getEnvValue('RUNBOTICS_PASSWORD');

        if (!username || !password) {
            throw new Error('Bot username or password not provided, try e.g. "./RunBotics.exe -- -u=myUsername -p=myPassword" or specify RUNBOTICS_USERNAME and RUNBOTICS_PASSWORD in .env file');
        }

        return {
            username: username,
            password: password,
        };
    }

    get collection(): string {
        return this.getEnvValue('RUNBOTICS_BOT_COLLECTION');
    }

    get version(): string {
        return version;
    }

    get logger(): string {
        return this.getEnvValue('RUNBOTICS_LOGGER');
    }

    get cfgGeckoDriver(): string {
        return this.getEnvValue('CFG_GECKO_DRIVER');
    }

    get cfgFirefoxBin(): string {
        return this.getEnvValue('CFG_FIREFOX_BIN');
    }

    get chromeAddress(): string {
        return this.getEnvValue('CHROME_ADDRESS');
    }

    get mailUsername(): string {
        return this.getEnvValue('MAIL_USERNAME');
    }

    get mailPassword(): string {
        return this.getEnvValue('MAIL_PASSWORD');
    }

    get mailHost(): string {
        return this.getEnvValue('MAIL_HOST');
    }

    get mailPort(): string {
        return this.getEnvValue('MAIL_PORT');
    }

    get googleAuth(): GoogleAuth {
        return {
            privateKey: this.getEnvValue('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'),
            serviceAccountEmail: this.getEnvValue(
                'GOOGLE_SERVICE_ACCOUNT_EMAIL'
            ),
        };
    }

    get jiraUsername(): string {
        return this.getEnvValue('JIRA_USERNAME');
    }

    get jiraPassword(): string {
        return this.getEnvValue('JIRA_PASSWORD');
    }

    get jiraUrl(): string {
        return this.getEnvValue('JIRA_URL');
    }

    get jiraA41Username(): string {
        return this.getEnvValue('JIRA_A41_USERNAME');
    }

    get jiraA41Token(): string {
        return this.getEnvValue('JIRA_A41_TOKEN');
    }

    get jiraA41Url(): string {
        return this.getEnvValue('JIRA_A41_URL');
    }

    get microsoftAuth(): MicrosoftAuth {
        return {
            tenantId: this.getEnvValue('MS_TENANT_ID'),
            clientId: this.getEnvValue('MS_CLIENT_ID'),
            clientSecret: this.getEnvValue('MS_CLIENT_SECRET'),
            username: this.getEnvValue('MS_USERNAME'),
            password: this.getEnvValue('MS_PASSWORD'),
        };
    }

    get beeAuth() {
        return {
            grant_type: 'password',
            username: this.getEnvValue('BEE_USER'),
            password: this.getEnvValue('BEE_PASS'),
            logsys: this.getEnvValue('BEE_LOGSYS'),
        };
    }

    get beeUrl() {
        return this.getEnvValue('BEE_URL');
    }

    get tempFolderPath(): string {
        return `${process.cwd()}/temp`;
    }

    private getEnvValue(key: string): string | undefined {
        const configValue = this.configService.get(key);
        const fullEncKey = process.argv.find((arg) =>
            arg.startsWith('--enc-key=')
        );
        const encKey = fullEncKey ? fullEncKey.split('=')[1] : '';
        return encKey && configValue
            ? decrypt(configValue, encKey)
            : configValue;
    }
}

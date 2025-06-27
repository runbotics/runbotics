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

    get pluginsDirPath(): string {
        return this.getEnvValue('RUNBOTICS_PLUGINS_DIR');
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

    get authTokenRefreshSeconds(): number {
        const envVarName = 'RUNBOTICS_REFRESH_AUTH_TOKEN_SECONDS';
        const stringValue = this.getEnvValue(envVarName);
        if (stringValue === undefined) {
            return 60 * 60 * 24 * 14; // 14 days
        }
        const parsedValue = parseInt(stringValue);
        if (isNaN(parsedValue)) {
            throw new Error(`Failed to parse ${envVarName}; ${stringValue} is not a number`);
        }
        return parsedValue;
    }

    get autoTokenRefreshLeewaySeconds(): number {
        const envVarName = 'RUNBOTICS_AUTO_REFRESH_AUTH_TOKEN_LEEWAY_SECONDS';
        const stringValue = this.getEnvValue(envVarName);
        if (stringValue === undefined) {
            return 60 * 60 * 24; // 1 day
        }
        const parsedValue = parseInt(stringValue);
        if (isNaN(parsedValue)) {
            throw new Error(`Failed to parse ${envVarName}; ${stringValue} is not a number`);
        }
        return parsedValue;
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

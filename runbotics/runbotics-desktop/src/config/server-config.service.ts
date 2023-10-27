import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
// @ts-ignore
import { version } from '../../package.json';
import { decrypt } from '#utils/decryptor';

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

@Injectable()
export class ServerConfigService {
    constructor(private configService: ConfigService) {}

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
        return {
            username: this.getEnvValue('RUNBOTICS_USERNAME'),
            password: this.getEnvValue('RUNBOTICS_PASSWORD'),
        };
    }

    get collection(): string {
        return this.getEnvValue('RUNBOTICS_BOT_COLLECTION');
    }

    get system(): string {
        return this.getEnvValue('RUNBOTICS_BOT_SYSTEM');
    }

    get version(): string {
        return version;
    }

    get logger(): string {
        return this.getEnvValue('RUNBOTICS_LOGGER');
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

    get tempFolderPath(): string {
        return `${process.cwd()}/temp`;
    }

    private getEnvValue(key: string): string | undefined {
        const configValue = this.configService.get(key);
        const isEncrypted: boolean = JSON.parse(this.configService.get('ENCRYPTED'));
        if (isEncrypted && configValue) {
            return decrypt(configValue, this.configService.get('ENC_KEY'));
        }
        return configValue;
    }
}

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
// @ts-ignore
import { version } from '../../package.json';

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
        return this.configService.get('RUNBOTICS_EXTENSION_DIR');
    }

    get entrypointUrl(): string {
        return this.configService.get('RUNBOTICS_ENTRYPOINT_URL');
    }

    get entrypointSchedulerUrl(): string {
        return this.configService.get('RUNBOTICS_SCHEDULER_ENTRYPOINT_URL');
    }

    get installationId(): string {
        return this.configService.get('RUNBOTICS_INSTALLATION_ID');
    }

    get credentials(): Credentials {
        return {
            username: this.configService.get('RUNBOTICS_USERNAME'),
            password: this.configService.get('RUNBOTICS_PASSWORD'),
        };
    }

    get collection(): string {
        return this.configService.get('RUNBOTICS_BOT_COLLECTION');
    }

    get system(): string {
        return this.configService.get('RUNBOTICS_BOT_SYSTEM');
    }

    get version(): string {
        return version;
    }

    get logger(): string {
        return this.configService.get('RUNBOTICS_LOGGER');
    }

    get microsoftAuth(): MicrosoftAuth {
        return {
            tenantId: this.configService.get('MS_TENANT_ID'),
            clientId: this.configService.get('MS_CLIENT_ID'),
            clientSecret: this.configService.get('MS_CLIENT_SECRET'),
            username: this.configService.get('MS_USERNAME'),
            password: this.configService.get('MS_PASSWORD'),
        };
    }
}

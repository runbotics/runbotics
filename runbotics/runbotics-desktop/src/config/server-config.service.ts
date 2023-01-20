import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
// @ts-ignore
import { version } from '../../package.json';

export type ICredentials = {
    username: string;
    password: string;
};

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

    get credentials(): ICredentials {
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
}

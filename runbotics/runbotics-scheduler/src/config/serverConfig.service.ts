import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export interface Credentials {
    username: string;
    password: string;
}

export interface RedisSettings {
    host: string;
    port: number;
    maxRetriesPerRequest: number;
    enableReadyCheck: boolean;
}

export interface DatabaseSettings {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface EmailConfig {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
}

@Injectable()
export class ServerConfigService {
    constructor(private configService: ConfigService) { }

    get entrypointUrl(): string {
        return this.configService.get('RUNBOTICS_ENTRYPOINT_URL');
    }

    get redisSettings(): RedisSettings {
        return {
            host: this.configService.get('RUNBOTICS_SCHEDULER_REDIS_HOST'),
            port: this.configService.get('RUNBOTICS_SCHEDULER_REDIS_PORT'),
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        };
    }

    get dbSettings(): DatabaseSettings {
        return {
            host: this.configService.get('RUNBOTICS_DB_HOST'),
            port: this.configService.get('RUNBOTICS_DB_PORT'),
            username: this.configService.get('RUNBOTICS_DB_USER'),
            password: this.configService.get('RUNBOTICS_DB_PASSWORD'),
            database: this.configService.get('RUNBOTICS_DB_DATABASE'),
        };
    }

    get secret() {
        const secret: string | undefined = this.configService.get('RUNBOTICS_SECRET');
        return Buffer.from(secret, 'base64');
    }

    get botLogsDirectoryPath(): string {
        return this.configService.get('BOT_LOGS_DIRECTORY');
    }
    get requiredBotVersion(): string {
        return this.configService.get('MIN_BOT_VERSION');
    }

    get sharepointTenantId(): string {
        return this.configService.get('SHAREPOINT_TENANT_ID');
    }

    get sharepointClientId(): string {
        return this.configService.get('SHAREPOINT_CLIENT_ID');
    }

    get sharepointUsername(): string {
        return this.configService.get('SHAREPOINT_USERNAME');
    }

    get sharepointPassword(): string {
        return this.configService.get('SHAREPOINT_PASSWORD');
    }

    get readEmailConfig(): EmailConfig {
        return {
            host: this.configService.get('RUNBOTICS_READ_EMAIL_HOST'),
            port: this.configService.get('RUNBOTICS_READ_EMAIL_PORT'),
            auth: {
                user: this.configService.get('RUNBOTICS_EMAIL'),
                pass: this.configService.get('RUNBOTICS_EMAIL_PASSWORD')
            }
        };
    }
    
    get sendEmailConfig(): EmailConfig {
        return {
            host: this.configService.get('RUNBOTICS_SEND_EMAIL_HOST'),
            port: this.configService.get('RUNBOTICS_SEND_EMAIL_PORT'),
            auth: {
                user: this.configService.get('RUNBOTICS_EMAIL'),
                pass: this.configService.get('RUNBOTICS_EMAIL_PASSWORD')
            }
        };
    }

    get timezone(): string {
        return 'Europe/Warsaw';
    }
}

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
    DatabaseSettings, EmailConfig, EmailTriggerConfig, MailConfig, MicrosoftAuth, RedisSettings,
} from './server-config.types';

@Injectable()
export class ServerConfigService {

    constructor(
        private configService: ConfigService,
    ) {
    }

    get entrypointUrl(): string | undefined {
        return this.configService.get('RUNBOTICS_ENTRYPOINT_URL');
    }

    get redisSettings(): RedisSettings {
        return {
            host: this.configService.get('RUNBOTICS_SCHEDULER_REDIS_HOST'),
            port: this.convertNumber(this.configService.get('RUNBOTICS_SCHEDULER_REDIS_PORT')),
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        };
    }

    get dbSettings(): DatabaseSettings {
        return {
            host: this.configService.get('RUNBOTICS_DB_HOST'),
            port: this.convertNumber(this.configService.get('RUNBOTICS_DB_PORT')),
            username: this.configService.get('RUNBOTICS_DB_USER'),
            password: this.configService.get('RUNBOTICS_DB_PASSWORD'),
            database: this.configService.get('RUNBOTICS_DB_DATABASE'),
        };
    }

    get secret(): Buffer | undefined {
        const secret: string | undefined = this.configService.get('RUNBOTICS_SECRET');
        return secret ? Buffer.from(secret, 'base64') : undefined;
    }

    get botLogsDirectoryPath(): string | undefined {
        return this.configService.get('BOT_LOGS_DIRECTORY');
    }

    get requiredBotVersion(): string | undefined {
        return this.configService.get('MIN_BOT_VERSION');
    }

    get readEmailTriggerConfig(): EmailConfig {
        return {
            host: this.configService.get('BASIC_EMAIL_TRIGGER_READ_HOST'),
            port: this.convertNumber(this.configService.get('BASIC_EMAIL_TRIGGER_READ_PORT')),
            auth: {
                user: this.configService.get('BASIC_EMAIL_TRIGGER_USERNAME'),
                pass: this.configService.get('BASIC_EMAIL_TRIGGER_PASSWORD'),
            },
        };
    }

    get writeEmailTriggerConfig(): EmailConfig {
        return {
            host: this.configService.get('BASIC_EMAIL_TRIGGER_WRITE_HOST'),
            port: this.convertNumber(this.configService.get('BASIC_EMAIL_TRIGGER_WRITE_PORT')),
            auth: {
                user: this.configService.get('BASIC_EMAIL_TRIGGER_USERNAME'),
                pass: this.configService.get('BASIC_EMAIL_TRIGGER_PASSWORD'),
            },
        };
    }

    get timezone(): string {
        return this.configService.get('TIMEZONE') || 'Europe/Warsaw';
    }

    get emailTriggerConfig(): EmailTriggerConfig {
        const domainWhitelist = (this.configService.get('EMAIL_TRIGGER_DOMAIN_WHITELIST') as string)
            ?.split(',')
            .reduce<string[]>((acc, domain) => {
                const trimDomain = domain.trim();
                if (trimDomain === '')
                    return acc;
                else
                    return [...acc, trimDomain];
            }, []);

        return {
            mailbox: this.configService.get('EMAIL_TRIGGER_MAILBOX'),
            domainWhitelist,
        };
    }

    get microsoftAuth(): MicrosoftAuth {
        let msCallbackUrlBase = this.configService.get('MS_CALLBACK_URL_BASE');
        if (!msCallbackUrlBase) {
            msCallbackUrlBase = this.configService.get('RUNBOTICS_ENTRYPOINT_URL');
        }
        return {
            tenantId: this.configService.get('MS_TENANT_ID'),
            clientId: this.configService.get('MS_CLIENT_ID'),
            clientSecret: this.configService.get('MS_CLIENT_SECRET'),
            username: this.configService.get('MS_USERNAME'),
            password: this.configService.get('MS_PASSWORD'),
            discoveryKeysUri: this.configService.get('MS_DISCOVERY_KEYS_URI'),
            isSsoEnabled: this.configService.get('IS_SSO_ENABLED'),
            msCallbackUrlBase,
        };
    }

    get mailConfig(): MailConfig {
        return {
            mailHost: this.configService.get('MAIL_HOST'),
            mailPort: this.configService.get('MAIL_PORT'),
            mailUsername: this.configService.get('MAIL_USERNAME'),
            mailPassword: this.configService.get('MAIL_PASSWORD'),
        };
    }

    get encryptionKey(): string {
        return this.configService.get('ENCRYPTION_KEY');
    }

    private convertNumber(variable: string | undefined): number | undefined {
        const numericVariable = Number(variable);
        return Number.isNaN(numericVariable) ? undefined : numericVariable;
    }
}

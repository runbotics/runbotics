export interface RedisSettings {
    host: string | undefined;
    port: number | undefined;
    maxRetriesPerRequest: null;
    enableReadyCheck: boolean;
}

export interface DatabaseSettings {
    host: string | undefined;
    port: number | undefined;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
}

export interface EmailConfig {
    host: string | undefined;
    port: number | undefined;
    auth: {
        user: string | undefined;
        pass: string | undefined;
    };
}

export interface MicrosoftAuth {
    tenantId: string | undefined;
    clientId: string | undefined;
    clientSecret: string | undefined;
    username: string | undefined;
    password: string | undefined;
}

export interface MicrosoftSSO {
    tenantId: string | undefined;
    clientId: string | undefined;
    clientSecret: string | undefined;   
    callbackUrlBase: string | undefined;
    isSsoEnabled: boolean;
    appAuthority: string | undefined;
}

export interface EmailTriggerConfig {
    mailbox: string | undefined;
    domainWhitelist: string[];
}

export interface MailConfig {
    mailHost: string | undefined;
    mailPort: string | undefined;
    mailUsername: string | undefined;
    mailPassword: string | undefined;
}

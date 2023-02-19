import { Injectable } from '@nestjs/common';
import { AccountInfo, ConfidentialClientApplication, Configuration, UsernamePasswordRequest } from '@azure/msal-node';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { Logger } from 'src/utils/logger';

const dev = {
    tenantId: '',
    clientId: '',
    user: '',
    pass: '',
    secret: '',
};

const prod = {
    tenantId: '',
    clientId: '',
    user: '',
    pass: '',
};

const configProd: Configuration = {
    auth: {
        clientId: prod.clientId,
        authority: `https://login.microsoftonline.com/${prod.tenantId}`,
    },
};

const configDev: Configuration = {
    auth: {
        clientId: dev.clientId,
        authority: `https://login.microsoftonline.com/${dev.tenantId}`,
        clientSecret: dev.secret,
    },
};

const prodConfig: UsernamePasswordRequest = {
    password: prod.pass,
    username: prod.user,
    scopes: ['user.read'],
};

const devConfig: UsernamePasswordRequest = {
    password: dev.pass,
    username: dev.user,
    scopes: ['user.read'],
};

@Injectable()
export class MicrosoftAuthService implements AuthenticationProvider {
    private readonly logger = new Logger(MicrosoftAuthService.name);
    private readonly microsoftAuth: ConfidentialClientApplication; 
    private account: AccountInfo;

    constructor() {
        this.microsoftAuth = new ConfidentialClientApplication(configDev);
    }
    
    async getAccessToken() {
        this.logger.log('Reading MS token from cache');
        const authResponse = await this.microsoftAuth.acquireTokenSilent({
            account: this.account,
            scopes: ['user.read'],
        })
            .then(response => {
                this.logger.log('MS token cache hit');
                return response;
            })
            .catch((e) => {
                this.logger.warn('No MS token in cache');
                return this.getNewToken();
            });
        return authResponse.accessToken;
    }

    async getNewToken() {
        this.logger.log('Requesting Microsoft access token');
        const authResponse = await this.microsoftAuth.acquireTokenByUsernamePassword(devConfig);
        this.account = authResponse.account;
        this.logger.log('Success: Microsoft access token acquired');
        return authResponse;
    }

}
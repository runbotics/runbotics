import { Injectable } from '@nestjs/common';
import { AccountInfo, ConfidentialClientApplication, Configuration, UsernamePasswordRequest } from '@azure/msal-node';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { Logger } from 'src/utils/logger';

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
            .catch(() => {
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

import { Injectable } from '@nestjs/common';
import { AccountInfo, ConfidentialClientApplication, Configuration, UsernamePasswordRequest } from '@azure/msal-node';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { Logger } from 'src/utils/logger';
import { ServerConfigService } from 'src/config/server-config/server-config.service';

const scopes = [
    // COMMON
    'User.Read',
    // ONE DRIVE
    'Files.Read', 'Files.Read.All', 'Files.ReadWrite', 'Files.ReadWrite.All',
    // SHAREPOINT
    'Sites.ReadWrite.All', 'Sites.Read.All',
    // OUTLOOK
    'IMAP.AccessAsUser.All', 'Mail.ReadWrite', 'Mail.Send',
];

@Injectable()
export class MicrosoftAuthService implements AuthenticationProvider {
    private readonly logger = new Logger(MicrosoftAuthService.name);
    private readonly microsoftAuth: ConfidentialClientApplication; 
    private account: AccountInfo;

    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        const config: Configuration = {
            auth: {
                clientId: this.serverConfigService.microsoftAuth.clientId,
                authority: `https://login.microsoftonline.com/${this.serverConfigService.microsoftAuth.tenantId}`,
                clientSecret: this.serverConfigService.microsoftAuth.clientSecret,
            },
        };
        this.microsoftAuth = new ConfidentialClientApplication(config);
    }
    
    async getAccessToken() {
        const authResponse = await this.microsoftAuth.acquireTokenSilent({
            account: this.account,
            scopes,
        })
            .then(response => {
                this.logger.log('MS token persisted from cache');
                return response;
            })
            .catch(() => {
                return this.getNewToken();
            });
        return authResponse.accessToken;
    }

    async getNewToken() {
        this.logger.log('Requesting new Microsoft access token');
        const config: UsernamePasswordRequest = {
            username: this.serverConfigService.microsoftAuth.username,
            password: this.serverConfigService.microsoftAuth.password,
            scopes,
        };
        const authResponse = await this.microsoftAuth.acquireTokenByUsernamePassword(config);
        this.account = authResponse.account;
        this.logger.log('Success: Microsoft access token acquired');
        return authResponse;
    }

}

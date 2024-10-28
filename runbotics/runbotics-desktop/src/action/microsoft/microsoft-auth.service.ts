import { AccountInfo, ConfidentialClientApplication, Configuration, UsernamePasswordRequest } from '@azure/msal-node';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';

import { RunboticsLogger } from '#logger';
import { ServerConfigService } from '#config/server-config.service';
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { MicrosoftCredential } from './common.types';

const scopes = [
    // Common
    'User.Read',
    // OneDrive
    'Files.Read', 'Files.Read.All', 'Files.ReadWrite', 'Files.ReadWrite.All',
    // Sharepoint
    'Sites.ReadWrite.All', 'Sites.Read.All',
];

export class MicrosoftAuthService implements AuthenticationProvider {
    private readonly logger = new RunboticsLogger(MicrosoftAuthService.name);
    private microsoftAuth: ConfidentialClientApplication = null;
    private account: AccountInfo = null;

    constructor(
        private readonly authCredentials: MicrosoftCredential,
    ) {
        this.logger.debug('AUTH CREDENTIALS: ', authCredentials);
        if (!this.hasCredentials()) {
            this.logger.error('Microsoft credentials are not provided - Microsoft related features won\'t be available');
            return;
        }

        const config: Configuration = {
            auth: {
                clientId: this.authCredentials.config.auth.clientId,
                authority: `https://login.microsoftonline.com/${this.authCredentials.config.auth.authority}`,
                clientSecret: this.authCredentials.config.auth.clientSecret
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
            username: this.authCredentials.loginCredential.username,
            password: this.authCredentials.loginCredential.password,
            scopes,
        };
        const authResponse = await this.microsoftAuth.acquireTokenByUsernamePassword(config);
        this.account = authResponse.account;
        this.logger.log('Success: Microsoft access token acquired');
        return authResponse;
    }

    hasCredentials() {
        return this.authCredentials.config.auth.clientId
            && this.authCredentials.config.auth.authority
            && this.authCredentials.config.auth.clientSecret
            && this.authCredentials.loginCredential.username
            && this.authCredentials.loginCredential.password;
    }

}

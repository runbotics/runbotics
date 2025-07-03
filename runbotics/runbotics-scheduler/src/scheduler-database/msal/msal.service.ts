import { ServerConfigService } from '#/config/server-config';
import { Logger } from '#/utils/logger';
import { ConfidentialClientApplication, Configuration, LogLevel, ResponseMode } from '@azure/msal-node';
import { MsalCallbackData, MsalLoginData, MsalLoginResponse, MsalProfileData } from './msal.types';

import { jwtDecode } from 'jwt-decode';
import { z } from 'zod';
import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmailValid } from 'runbotics-common';

const MSAL_SCOPES = ['openid', 'profile', 'email', 'User.Read'];

const idTokenSchema = z.object({
    tid: z.string(),
    sub: z.string(),
    oid: z.string(),
});

const profileDataSchema = z.object({
    mail: z.string().optional().nullable(),
    userPrincipalName: z.string().optional().nullable(),
    preferredLanguage: z.string().optional().nullable(),
});

@Injectable()
export class MsalService {
    private readonly logger = new Logger(MsalService.name);

    constructor(
        private readonly serverConfigService: ServerConfigService
    ) { }

    ensureSsoEnabled() {
        if(!this.serverConfigService.microsoftSso.isSsoEnabled) {
            throw new NotFoundException();
        }
    }

    async handleLoginCallback(
        loginData: MsalCallbackData
    ): Promise<MsalLoginResponse> {
        const msalInstance = this.getMsalInstance();

        const tokenResponse = await msalInstance.acquireTokenByCode({
            code: loginData.code,
            scopes: MSAL_SCOPES,
            redirectUri: this.getRedirectUri(),
        });

        const rawIdToken = jwtDecode(tokenResponse.idToken);
        const idToken = idTokenSchema.parse(rawIdToken);

        const accessToken = tokenResponse.accessToken;

        return {
            accessToken,
            tenantId: idToken.tid,
            objectId: idToken.oid,
        };
    }

    async beginLogin(): Promise<MsalLoginData> {
        const msalInstance = this.getMsalInstance();

        const url = await msalInstance.getAuthCodeUrl({
            scopes: MSAL_SCOPES,
            redirectUri: this.getRedirectUri(),
            responseMode: ResponseMode.FORM_POST,
        });

        return { url };
    }

    async fetchProfileData(authToken: string): Promise<MsalProfileData> {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        const data = profileDataSchema.parse(response.data);
        const email = data.mail || '';

        if (email && !isEmailValid(email)) {
            throw new Error('Received invalid email from MS API');
        }

        // Extract langKey from preferredLanguage, fallback to 'en'
        const lng = data.preferredLanguage?.split('-')[0];
        const langKey = lng && /pl/i.test(lng) ? 'pl' : 'en';
        return { email, langKey };
    }

    private getMsalInstance() {
        return new ConfidentialClientApplication(this.getMsalConfiguration());
    }

    private getMsalConfiguration(): Configuration {
        const config = this.serverConfigService.microsoftSso;
        return {
            auth: {
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                authority: 'https://login.microsoftonline.com/common'
            },
            system: {
                loggerOptions: {
                    loggerCallback: (logLevel, message, containsPii) => {
                        // Do not log if contains Personally Identifiable Information
                        if (containsPii) {
                            return;
                        }

                        if (logLevel === LogLevel.Error) {
                            this.logger.error(message);
                        } else if (logLevel === LogLevel.Warning) {
                            this.logger.warn(message);
                        } else if (logLevel === LogLevel.Info) {
                            this.logger.log(message);
                        }

                        // Trace and verbose log levels are skipped
                    },
                    piiLoggingEnabled: false,
                }
            }
        };
    }

    private getRedirectUri() {
        const config = this.serverConfigService.microsoftSso;
        let baseUrl = config.callbackUrlBase;
        if (!/^https?:\/\//i.test(baseUrl)) {
            baseUrl = `http://${baseUrl}`;
        }
        const url = new URL('/scheduler/msal/callback', baseUrl);
        return url.toString();
    }
}
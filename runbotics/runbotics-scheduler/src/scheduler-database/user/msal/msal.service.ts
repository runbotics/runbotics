import { ServerConfigService } from '#/config/server-config';
import { Logger } from '#/utils/logger';
import { ConfidentialClientApplication, Configuration, LogLevel, ResponseMode } from '@azure/msal-node';
import { MsalCallbackData, MsalLoginData, MsalLoginResponse } from './msal.types';

import { jwtDecode } from 'jwt-decode';
import { z } from 'zod';
import axios from 'axios';

const MSAL_SCOPES = ["openid", "profile", "email"];

const idTokenSchema = z.object({
    tid: z.string()
})

const MsalProfileDataSchema = z.object({
    email: z.string()
})

export class MsalService {
    private readonly logger = new Logger(MsalService.name);

    constructor(
        private readonly serverConfigService: ServerConfigService
    ) { }

    async handleLoginCallback(
        loginData: MsalCallbackData
    ): Promise<MsalLoginResponse> {
        const msalInstance = this.getMsalInstance();

        const tokenResponse = await msalInstance.acquireTokenByCode({
            code: loginData.code,
            scopes: MSAL_SCOPES,
            redirectUri: this.getRedirectUri(),
        })

        const rawIdToken = jwtDecode(tokenResponse.idToken)
        const idToken = idTokenSchema.parse(rawIdToken)

        const accessToken = tokenResponse.accessToken

        return {
            accessToken,
            tenantId: idToken.tid,
        }
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

    async fetchProfileData(authToken: string): Promise<z.infer<typeof MsalProfileDataSchema>> {
        const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        return MsalProfileDataSchema.parse(response.data)
    }

    private getMsalInstance() {
        return new ConfidentialClientApplication(this.getMsalConfiguration());
    }

    private getMsalConfiguration(): Configuration {
        return {
            auth: {
                clientId: this.serverConfigService.microsoftAuth.clientId,
                clientSecret: this.serverConfigService.microsoftAuth.clientSecret,
                authority: `https://login.microsoftonline.com/${this.serverConfigService.microsoftAuth.tenantId}`
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
        return this.serverConfigService.microsoftAuth.redirectUri;
    }
}
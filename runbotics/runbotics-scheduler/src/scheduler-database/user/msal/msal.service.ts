import { ServerConfigService } from '#/config/server-config';
import { Logger } from '#/utils/logger';
import { ConfidentialClientApplication, Configuration, CryptoProvider, LogLevel, ResponseMode } from '@azure/msal-node';
import { MsalCallbackData, MsalLoginData } from './msal.types';

export class MsalService {
    private readonly logger = new Logger(MsalService.name);

    constructor(
        private readonly serverConfigService: ServerConfigService
    ) { }

    getScopes(): string[] {
        return [];
    }

    getMsalCryptoProvider() {
        return new CryptoProvider();
    }

    getRedirectUri() {
        return this.serverConfigService.microsoftAuth.redirectUri;
    }

    getPostLogoutRedirectUri() {
        return this.serverConfigService.microsoftAuth.postLogoutRedirectUri;
    }

    getMsalConfiguration(): Configuration {
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
                        } else if(logLevel === LogLevel.Warning) {
                            this.logger.warn(message);
                        }  else if(logLevel === LogLevel.Info) {
                            this.logger.log(message);
                        } 

                        // Trace and verbose log levels are skipped
                    },
                    piiLoggingEnabled: false,
                }
            }
        };
    }

    async handleLoginCallback(
        loginData: MsalCallbackData
    ) {
        const msalInstance = this.getMsalInstance();

        const tokenResponse = await msalInstance.acquireTokenByCode(
            {
                code: loginData.payload.code,
                codeVerifier: loginData.verifier,
                scopes: this.getScopes(),
                redirectUri: this.getRedirectUri(),
            },
            loginData.payload,
        );

        const idToken = tokenResponse.idToken;
        const accessToken = tokenResponse.accessToken;
        const msTenantId = tokenResponse.account.tenantId;
    }

    /**
     * Creates URL redirecting user to Microsoft servers with appropriate parameters, like client/app id.
     */
    async beginLogin(): Promise<MsalLoginData> {
        const cryptoProvider = this.getMsalCryptoProvider();

        /**
         * MSAL Node library allows you to pass your custom state as state parameter in the Request object.
         * The state parameter can also be used to encode information of the app's state before redirect.
         * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
         */
        const state = cryptoProvider.base64Encode(
            JSON.stringify({
                successRedirect: '/',
            })
        );

        const authCodeUrlRequestParams = {
            state: state,

            /**
             * By default, MSAL Node will add OIDC scopes to the auth code url request. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
             */
            scopes: this.getScopes(),
            redirectUri: this.getRedirectUri(),
        };

        const authCodeRequestParams = {
            state: state,

            /**
             * By default, MSAL Node will add OIDC scopes to the auth code request. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
             */
            scopes: this.getScopes(),
            redirectUri: this.getRedirectUri(),
        };

        const msalInstance = this.getMsalInstance();

        const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

        const url = await msalInstance.getAuthCodeUrl({
            ...authCodeUrlRequestParams,
            responseMode: ResponseMode.FORM_POST,
            codeChallenge: challenge,
            codeChallengeMethod: 'S256'
        });

        return {
            url,
            challenge,
            verifier
        };
    }

    private getMsalInstance() {
        return new ConfidentialClientApplication(this.getMsalConfiguration());
    }
}
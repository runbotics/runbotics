import { Configuration, PublicClientApplication } from '@azure/msal-browser';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const loginRequest = {
    scopes: ['User.Read'],
};

export const msalConfig: Configuration = {
    auth: {
        clientId: publicRuntimeConfig.microsoftAppId,
        authority: publicRuntimeConfig.microsoftAppAuthority,
        redirectUri: publicRuntimeConfig.microsoftAppRedirectUri,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;

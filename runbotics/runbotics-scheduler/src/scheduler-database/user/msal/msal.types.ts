import { AuthorizationCodePayload } from '@azure/msal-node'

export type MsalLoginData = {
    url: string,
    challenge: string,
    verifier: string
}

export type MsalCallbackData = {
    challenge: string,
    verifier: string,

    payload: AuthorizationCodePayload
}
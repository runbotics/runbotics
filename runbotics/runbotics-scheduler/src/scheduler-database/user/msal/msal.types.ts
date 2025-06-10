export type MsalLoginData = {
    url: string
}

export type MsalCallbackData = {
    code: string
}

export type MsalLoginResponse = {
    accessToken: string
    tenantId: string
}
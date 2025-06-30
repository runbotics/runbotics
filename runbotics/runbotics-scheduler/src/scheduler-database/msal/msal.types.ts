export type MsalLoginData = {
    url: string
}

export type MsalCallbackData = {
    code: string
}

export type MsalLoginResponse = {
    accessToken: string
    tenantId: string
    objectId: string
}

export type MsalProfileData = {
    email: string,
    langKey: string
}
export type MsalLoginData = {
    url: string
}

export type MsalCallbackData = {
    code: string
}

export type MsalLoginResponse = {
    accessToken: string
    tenantId: string

    /**
     * Identifies user within MS tenant.
     */
    subjectIdentifier: string;

    /**
     * Identifies user globally across all MS tenants.
     */
    userIdentifier: string
}

export type MsalProfileData = {
    email: string,
    langKey: string
}
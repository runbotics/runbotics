export type TokenData = {
    token: string,
    expiresAt: number, // In seconds, like in JWT
    tenantId: string,
    installationId: string
}
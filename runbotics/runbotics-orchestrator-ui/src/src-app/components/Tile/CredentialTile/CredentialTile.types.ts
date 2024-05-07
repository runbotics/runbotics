export interface Credential {
    id?: string,
    name: string,
    description: string,
    collection: string,
    collectionColor?: string
}

export interface CredentialTileProps {
    credential: Credential
}

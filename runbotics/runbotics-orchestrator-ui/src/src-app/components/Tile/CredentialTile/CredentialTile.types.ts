import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

export interface CredentialTileProps {
    credential: BasicCredentialDto
}

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

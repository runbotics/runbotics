import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';
import { BasicCredentialsCollectionDto } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

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
    credential: BasicCredentialDto;
    collection: BasicCredentialsCollectionDto;
    templateName: string;
    collectionName: string
}

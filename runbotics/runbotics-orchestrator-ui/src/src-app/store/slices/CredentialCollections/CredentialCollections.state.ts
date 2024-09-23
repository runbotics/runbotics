import { BasicCredentialsCollectionDto } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

export interface CredentialCollectionsState {
    credentialCollections: BasicCredentialsCollectionDto[];
    loading: boolean;
}

import { BasicCredentialsCollectionDto } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

export interface CredentialCollectionsState {
    data: BasicCredentialsCollectionDto[];
    loading: boolean
}

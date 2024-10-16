import { CredentialCollection } from 'runbotics-common';

export interface CredentialCollectionsState {
    credentialCollections: CredentialCollection[];
    loading: boolean;
}

import { Attribute } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.types';

export interface CredentialAttributesState {
    data: Attribute[],
    loading: boolean
}

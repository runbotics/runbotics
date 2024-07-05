import { DisplayAttribute } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.types';

export interface CredentialAttributesState {
    data: DisplayAttribute[],
    loading: boolean
}

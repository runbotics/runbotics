import { DisplayAttribute } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/Attribute.types';

export interface CredentialAttributesState {
    data: DisplayAttribute[],
    loading: boolean
}

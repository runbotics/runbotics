import { CredentialTemplate } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/Attribute.types';

export interface CredentialTemplatesState {
    data: CredentialTemplate[];
    loading: boolean;
}

import { CredentialTemplate } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/Attribute.types';

export interface CredentialTemplatesState {
    credentialTemplates: CredentialTemplate[];
    loading: boolean;
}

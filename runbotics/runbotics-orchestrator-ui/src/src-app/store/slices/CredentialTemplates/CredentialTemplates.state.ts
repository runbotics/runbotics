import { CredentialTemplate } from '#src-app/views/credentials/Credential/Credential.types';

export interface CredentialTemplatesState {
    data: CredentialTemplate[];
    loading: boolean;
}

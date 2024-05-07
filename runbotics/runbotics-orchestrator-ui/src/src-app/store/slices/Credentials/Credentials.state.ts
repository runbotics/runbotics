import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

export interface CredentialsState {
    all: BasicCredentialDto[];
    loading: boolean;
}

import { Credential, CredentialDto } from './credential.model';

export interface ProcessCredential {
    id: string;
    order: number;
    credential: Credential;
    credentialId: string;
    processId: string;
}

export interface ProcessCredentialDto
    extends Omit<ProcessCredential, "credential"> {
    credential: CredentialDto;
}

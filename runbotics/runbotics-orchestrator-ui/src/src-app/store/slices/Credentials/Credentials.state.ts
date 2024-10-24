import { Credential } from 'runbotics-common';

import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

export interface ProcessAssignedCredential {
    id: string;
    order: number;
    credentialId: string;
    processId: string;
    credential: Credential;
}

export interface CredentialsState {
    all: BasicCredentialDto[];
    allByTemplateAndProcess: Credential[];
    allProcessAssigned: ProcessAssignedCredential[];
    loading: boolean;
}

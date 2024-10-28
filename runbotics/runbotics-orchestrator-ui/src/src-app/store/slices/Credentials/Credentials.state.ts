import { Credential, ProcessCredential } from 'runbotics-common';

import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

export interface CredentialsState {
    all: BasicCredentialDto[];
    allByTemplateAndProcess: Credential[];
    allProcessAssigned: ProcessCredential[];
    loading: boolean;
}

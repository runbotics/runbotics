import { Credential } from 'runbotics-common';

import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

export interface CredentialsState {
    all: BasicCredentialDto[];
    allByTemplateAndProcess: Credential[];
    loading: boolean;
}

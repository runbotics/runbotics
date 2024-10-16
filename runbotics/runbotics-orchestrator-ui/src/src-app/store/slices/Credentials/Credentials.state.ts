import { Credential } from 'runbotics-common';

export interface CredentialsState {
    all: Credential[];
    allByTemplateAndProcess: Credential[];
    loading: boolean;
}

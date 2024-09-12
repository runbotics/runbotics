import { CredentialDto } from 'runbotics-common';


export interface CredentialsState {
    all: CredentialDto[];
    loading: boolean;
}

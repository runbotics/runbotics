import { Credential } from 'runbotics-common';


export interface CredentialsState {
    all: Credential[];
    loading: boolean;
}

import { Credential } from './credential.model';

export interface ProcessCredential {
    id: string;
    order: number;
    credential: Credential;
}

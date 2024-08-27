import { UserDTO } from 'runbotics-common';

export interface Credential {
    id: string;
    name: string;
    tenantId: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    templateId: string;
    createdBy: UserDTO;
    collection: {
        id: string;
        name: string;
    }
}

export interface CredentialsState {
    all: Credential[];
    loading: boolean;
}

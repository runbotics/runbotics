import { ActionCredentialType } from 'runbotics-common';

export interface CredentialInAction {
    authorName: string;
    collectionName: string;
    name: string;
    order: number;
    id: string;
};

export interface ActionCredentials extends Partial<Record<ActionCredentialType, CredentialInAction[]>> {};

export interface ActionSortedColumns extends Array<{
    count: number,
    actionCredentials: {
        name: string,
        credentials: CredentialInAction[]
    }[]
}> {};

export type CredentialId = string | null;

import { ProcessCollection } from 'runbotics-common';

export interface CollectionCreateParams {
    body: ProcessCollection;
}

export interface CollectionUpdateParams {
    id: string;
    body: ProcessCollection;
}

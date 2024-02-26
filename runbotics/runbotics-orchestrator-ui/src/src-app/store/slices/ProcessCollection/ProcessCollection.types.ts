import { ProcessCollection } from 'runbotics-common';

export interface CollectionCreateParams {
    body: ProcessCollection;
}

export interface ProcessCollectionPack {
    childrenCollections: ProcessCollection[];
    breadcrumbs: ProcessCollection[];
}

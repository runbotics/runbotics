import { CollectionId, ProcessCollection } from 'runbotics-common';

export interface CollectionCreateParams {
    body: ProcessCollection;
    parentId: CollectionId;
}

export interface CollectionUpdateParams {
    id: string;
    body: ProcessCollection;
    parentId: CollectionId;
}

export interface ProcessCollectionPack {
    childrenCollections: ProcessCollection[];
    breadcrumbs: ProcessCollection[];
}

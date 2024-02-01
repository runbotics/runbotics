import { IUser } from 'runbotics-common';

/* TODO After merge: use types from runbotics-commons -> process-collection.model.ts instead */
export type CollectionId = number;
export type CollectionName = string;

export interface ProcessCollectionTileProps {
    id: CollectionId;
    name: CollectionName;
    isPublic: boolean;
    parentId?: CollectionId;
    description?: string;
    created?: string;
    updated?: string;
    createdBy?: IUser;
    users?: IUser[];
};

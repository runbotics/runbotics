import { IUser } from "./user.model";

export type CollectionId = string;
export type CollectionName = string;

export interface ProcessCollection {
    id: CollectionId;
    name: CollectionName;
    isPublic: boolean;
    parentId: CollectionId;
    description?: string;
    users?: IUser[];
    createdBy?: IUser;
    created?: string;
    updated?: string;
}

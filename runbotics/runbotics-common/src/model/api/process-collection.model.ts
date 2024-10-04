import { UserDto } from "./user.model";

export const ROOT_PROCESS_COLLECTION_ID: null = null;
export type CollectionId = string | typeof ROOT_PROCESS_COLLECTION_ID;
export type CollectionName = string;

export interface ProcessCollection {
    id: CollectionId;
    name: CollectionName;
    isPublic: boolean;
    parentId: CollectionId;
    description?: string;
    users?: UserDto[];
    createdBy?: UserDto;
    created?: string;
    updated?: string;
}

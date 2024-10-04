import { CollectionId, UserDto, ProcessCollection } from 'runbotics-common';


export interface LocationOptionsProps {
    isModifyDialogOpen: boolean;
    handleChange: (newId: CollectionId ) => void;
    isOwner: boolean;
    collectionId: CollectionId;
}

export type ProcessCollectionHierarchy = ProcessCollection & { children?: ProcessCollectionHierarchy[], selectable: boolean};

export interface GetIconParams {
    isPublic: boolean,
    users: UserDto[]
}

export interface GetHierarchicalStructureParams {
    parentNode: ProcessCollectionHierarchy;
    allNodes: ProcessCollection[];
}

export interface GetHierarchicalStructureResult {
    parentNodeWithIcon: ProcessCollectionHierarchy;
}

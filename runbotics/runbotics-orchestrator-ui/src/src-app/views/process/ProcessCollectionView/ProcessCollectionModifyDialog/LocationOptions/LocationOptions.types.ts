import { CollectionId, UserDto, ProcessCollection, ProcessCollectionKeys, ProcessCollectionValues } from 'runbotics-common';


export interface LocationOptionsProps {
    isModifyDialogOpen: boolean;
    handleChange: (property: ProcessCollectionKeys, newValue: ProcessCollectionValues ) => void;
    editedCollectionId: string;
    isOwner: boolean;
    parentId?: string;
}

export type ProcessCollectionHierarchy = ProcessCollection & { children?: ProcessCollectionHierarchy[], selectable: boolean};

export interface GetIconParams {
    isPublic: boolean,
    users: UserDto[]
}

export interface GetHierarchicalStructureParams {
    parentNode: ProcessCollectionHierarchy;
    allNodes: ProcessCollection[];
    editedCollectionId: CollectionId;
}

export interface GetHierarchicalStructureResult {
    parentNodeWithIcon: ProcessCollectionHierarchy;
}

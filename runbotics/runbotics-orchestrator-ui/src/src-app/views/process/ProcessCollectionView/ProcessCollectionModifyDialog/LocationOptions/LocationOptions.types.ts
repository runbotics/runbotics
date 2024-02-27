import { IUser, ProcessCollection, ProcessCollectionKeys, ProcessCollectionValues } from 'runbotics-common';

export interface LocationOptionsProps {
    isModifyDialogOpen: boolean;
    handleChange: (property: ProcessCollectionKeys, newValue: ProcessCollectionValues ) => void;
    parentId?: string;
}

export type ProcessCollectionHierarchy = ProcessCollection & { children?: ProcessCollectionHierarchy[] };

export interface GetIconParams {
    isPublic: boolean,
    users: IUser[]
}

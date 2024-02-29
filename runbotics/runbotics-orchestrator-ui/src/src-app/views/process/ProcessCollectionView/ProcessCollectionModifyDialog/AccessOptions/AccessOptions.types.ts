import { IUser, ProcessCollection, ProcessCollectionKeys, ProcessCollectionValues } from 'runbotics-common';

export interface AccessOptionsProps {
    collectionData: ProcessCollection;
    handleChange: (property: ProcessCollectionKeys, newValue: ProcessCollectionValues ) => void;
    isOwner: boolean;
    usersWithoutAdmin: IUser[];
    isModifyDialogOpen: boolean;
}

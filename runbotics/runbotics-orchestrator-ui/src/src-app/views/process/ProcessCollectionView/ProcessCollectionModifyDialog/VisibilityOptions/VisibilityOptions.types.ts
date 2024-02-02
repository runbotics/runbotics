export interface VisibilityOptionsProps {
    collectionData: ProcessCollection;
    handleChange: (property: ProcessCollectionKeys, newValue: ProcessCollectionValues ) => void;
    isOwner: boolean;
    usersWithoutAdmin: IUser[];
}

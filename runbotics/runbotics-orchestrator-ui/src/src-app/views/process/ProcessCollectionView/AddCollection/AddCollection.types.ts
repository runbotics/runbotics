import { ProcessCollection } from 'runbotics-common';

export interface CollectionModifyDialogProps {
    collection: ProcessCollection;
    open: boolean;
    onClose: () => void;
}

export interface AddCollectionButtonProps {
    collection?: ProcessCollection;
}

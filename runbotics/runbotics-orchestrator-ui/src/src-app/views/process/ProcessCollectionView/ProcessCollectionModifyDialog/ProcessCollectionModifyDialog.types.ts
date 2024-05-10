import { ProcessCollection } from 'runbotics-common';

export interface ProcessCollectionModifyDialogProps {
    open: boolean;
    onClose: () => void;
    collection?: ProcessCollection;
}

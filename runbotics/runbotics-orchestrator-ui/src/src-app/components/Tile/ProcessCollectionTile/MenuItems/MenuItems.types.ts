import { ProcessCollection } from 'runbotics-common';

export interface EditCollectionProps {
    collection: ProcessCollection;
    onClose: () => void;
}

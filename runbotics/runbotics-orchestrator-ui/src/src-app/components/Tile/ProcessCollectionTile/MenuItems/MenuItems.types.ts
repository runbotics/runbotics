import { ProcessCollection } from 'runbotics-common';

export interface EditCollectionProps {
    collection: ProcessCollection;
    onClose: () => void;
}

export type DeleteCollectionProps = Pick<ProcessCollection, 'id' | 'name'> & { isOwner: boolean; };

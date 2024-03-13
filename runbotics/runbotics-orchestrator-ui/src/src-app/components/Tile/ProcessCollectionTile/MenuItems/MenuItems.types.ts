import { ProcessCollection } from 'runbotics-common';

export interface CollectionEditItemProps {
    collection: ProcessCollection;
    onClose: () => void;
}

export type CollectionDeleteItemProps = Pick<ProcessCollection, 'id' | 'name'> & { isOwner: boolean; };

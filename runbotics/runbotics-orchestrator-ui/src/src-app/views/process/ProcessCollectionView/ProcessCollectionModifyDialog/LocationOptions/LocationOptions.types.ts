import { ProcessCollectionKeys, ProcessCollectionValues } from 'runbotics-common';

export interface LocationOptionsProps {
    isOpen: boolean;
    handleChange: (property: ProcessCollectionKeys, newValue: ProcessCollectionValues ) => void;
    parentId?: string;
}

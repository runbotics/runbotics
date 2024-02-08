import { IProcess, ProcessCollection } from 'runbotics-common';

import { Page } from '../../../utils/types/page';

export interface ProcessCollectionState {
    current: ProcessCollection;
    childrenProcesses: {
        isLoading: boolean;
        list: IProcess[];
        byPage: Page<IProcess>;
    }
    childrenCollections: {
        isLoading: boolean;
        list: ProcessCollection[];
    }
}

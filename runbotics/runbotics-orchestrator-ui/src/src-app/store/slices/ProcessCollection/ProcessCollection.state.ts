import { IProcess, ProcessCollection } from 'runbotics-common';

import { Page } from '../../../utils/types/page';

export interface ProcessCollectionState {
    current: ProcessCollection;
    childrenProcesses: {
        isLoading: boolean;
        list: IProcess[];
        byPage: Page<IProcess>;
    }
    active: {
        isLoading: boolean;
        ancestors: ProcessCollection[];
        childrenCollections: ProcessCollection[];
    },
    allUserAccessible: {
        isLoading: boolean;
        list: ProcessCollection[];
    }
}

import { IProcess } from 'runbotics-common';
import { ProcessTab } from 'src/utils/process-tab';

export const buildProcessUrl = (process: IProcess, tabName = ProcessTab.RUN) => {

    return `/app/processes/${process.id}/${tabName}`;
}

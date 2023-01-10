import { IProcess } from 'runbotics-common';

import { ProcessTab } from '#src-app/utils/process-tab';

export const buildProcessUrl = (process: IProcess, tabName = ProcessTab.RUN) => `/app/processes/${process.id}/${tabName}`;

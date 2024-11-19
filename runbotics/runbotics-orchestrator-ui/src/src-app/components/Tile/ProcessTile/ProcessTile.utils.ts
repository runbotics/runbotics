import { ProcessDto } from 'runbotics-common';

import { ProcessTab } from '#src-app/utils/process-tab';

export const buildProcessUrl = (process: ProcessDto, tabName = ProcessTab.RUN) => `/app/processes/${process.id}/${tabName}`;

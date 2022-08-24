import { IProcess } from 'runbotics-common';
import { ProcessTab } from '../../../utils/process-tab';

export const buildProcessUrl = (process: IProcess) => `/app/processes/${process.id}/${ProcessTab.BUILD}`;

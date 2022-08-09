import { IProcess as IProcezz } from 'runbotics-common';

import { IBotType } from './bot-type';
import { IScheduleProcess } from './schedule-process.model';
import { IUser } from './user.model';

export interface IProcess extends IProcezz {}

// export interface IProcess {
//     id?: number;
//     name?: string;
//     description?: string | null;
//     definition?: string | null;
//     shared?: boolean | null;
//     autoStart?: boolean | null;
//     created?: string | null;
//     updated?: string | null;
//     defaultSubscription?: boolean | null;
//     commitId?: string | null;
//     createdBy?: IUser | null;
//     subscribers?: IUser[] | null;
//     schedules?: Omit<IScheduleProcess, 'process'>[] | null;
//     botTypes?: IBotType[];
// }

export const defaultValue: Readonly<IProcess> = {
    // shared: false,
    // autoStart: false,
    // defaultSubscription: false,
};

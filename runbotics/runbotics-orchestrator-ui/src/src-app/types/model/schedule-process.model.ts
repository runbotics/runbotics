import { IProcess } from 'runbotics-common';

import { IUser } from './user.model';

export interface IScheduleProcess {
    id?: number;
    cron?: string;
    process?: IProcess;
    user?: IUser;
    inputVariables?: string;
    active?: boolean;
}

export const defaultValue: Readonly<IScheduleProcess> = {};

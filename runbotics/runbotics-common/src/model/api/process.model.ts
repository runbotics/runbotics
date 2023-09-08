import { IScheduleProcess } from './schedule-process.model';
import { IUser } from './user.model';
import { IBotSystem } from './bot-system.model';
import { IBotCollection } from './bot-collection.model';
import { Tag } from './tag.model';

export interface IProcess {
    id?: number;
    name?: string;
    description?: string | null;
    definition?: string | null;
    isPublic?: boolean | null;
    isAttended?: boolean | null;
    isTriggerable?: boolean | null;
    created?: string | null;
    updated?: string | null;
    executionsCount?: number | null;
    successExecutionsCount?: number | null;
    failureExecutionsCount?: number | null;
    executionInfo?: string | null;
    system?: IBotSystem | null;
    createdBy?: IUser | null;
    schedules?: Omit<IScheduleProcess, 'process'>[] | null;
    botCollection?: IBotCollection | null;
    tags?: Tag[];
}

export const defaultProcessValue: Readonly<IProcess> = {
    isPublic: false,
};

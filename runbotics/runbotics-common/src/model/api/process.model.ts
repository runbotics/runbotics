import { IScheduleProcess } from './schedule-process.model';
import { IUser } from './user.model';
import { IBotSystem } from './bot-system.model';
import { IBotCollection } from './bot-collection.model';
import { Tag } from './tag.model';
import { ProcessOutput } from './process-output.model';
import { ProcessCollection } from './process-collection.model';
import { NotificationProcess } from './notification-process.model';

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
    lastRun?: string | null;
    executionInfo?: string | null;
    system?: IBotSystem | null;
    createdBy?: IUser | null;
    schedules?: Omit<IScheduleProcess, 'process'>[] | null;
    botCollection?: IBotCollection | null;
    processCollection?: ProcessCollection | null;
    editor?: IUser | null;
    tags?: Tag[];
    notifications?: NotificationProcess[];
    outputType?: ProcessOutput;
}

export const defaultProcessValue: Readonly<IProcess> = {
    isPublic: false,
};

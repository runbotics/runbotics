import { IScheduleProcess } from './schedule-process.model';
import { BasicUserDto, User } from './user.model';
import { BotSystemType, IBotSystem } from './bot-system.model';
import { IBotCollection } from './bot-collection.model';
import { Tag } from './tag.model';
import { ProcessOutput } from './process-output.model';
import { ProcessCollection } from './process-collection.model';
import { Tenant } from './tenant.model';
import { WebhookProcessTrigger } from './webhook.model';

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
    systemName?: BotSystemType | null;
    createdBy?: User | null;
    schedules?: Omit<IScheduleProcess, 'process'>[] | null;
    botCollection?: IBotCollection | null;
    processCollection?: ProcessCollection | null;
    editor?: User | null;
    tags?: Tag[];
    webhookTriggers?: WebhookProcessTrigger[] | null;
    output?: ProcessOutput;
    tenantId?: Tenant['id'];
}

export type ProcessDto = Omit<IProcess, 'createdBy' | 'editor'> & {
    createdBy?: BasicUserDto;
    editor?: BasicUserDto;
};

export const defaultProcessValue: Readonly<ProcessDto> = {
    isPublic: false,
};

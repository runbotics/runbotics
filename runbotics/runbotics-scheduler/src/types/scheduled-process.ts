import { InstantProcess } from './instant-process';

export interface ScheduledProcess extends InstantProcess {
    id: number;
    cron: string;
}

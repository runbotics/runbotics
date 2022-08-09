import type { Job as QueueJob } from 'bull';
import { InstantProcess, ScheduledProcess } from 'src/types';

export const MAX_RETRY_BOT_AVAILABILITY = 60;

export type Job = QueueJob<ScheduledProcess | InstantProcess>;

export const isScheduledProcessJob = (job: Job): job is QueueJob<ScheduledProcess> => job.data
    && 'cron' in job.data
    && typeof job.data.cron === 'string';

import type { Job as QueueJob } from 'bull';
import { InstantProcess, ScheduledProcess } from 'runbotics-common';

export const MAX_RETRY_BOT_AVAILABILITY = 300; // 5 minutes

export type Job = QueueJob<ScheduledProcess | InstantProcess>;

export const isScheduledProcess = (
    process: InstantProcess
): process is ScheduledProcess => 'id' in process && 'cron' in process;

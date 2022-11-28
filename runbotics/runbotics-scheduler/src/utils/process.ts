import type { Job as QueueJob } from 'bull';
import { InstantProcess, ScheduledProcess } from 'src/types';

export const MAX_RETRY_BOT_AVAILABILITY = 60;

export type Job = QueueJob<ScheduledProcess | InstantProcess>;

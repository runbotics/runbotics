import { IProcess } from 'app/shared/model/process.model';
import { IBot } from 'app/shared/model/bot.model';

export interface IScheduleProcess {
  id?: number;
  cron?: string;
  process?: IProcess;
  bot?: IBot;
}

export const defaultValue: Readonly<IScheduleProcess> = {};

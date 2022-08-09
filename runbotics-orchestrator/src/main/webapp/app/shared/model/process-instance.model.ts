import dayjs from 'dayjs';
import { IProcess } from 'app/shared/model/process.model';
import { IBot } from 'app/shared/model/bot.model';

export interface IProcessInstance {
  id?: string;
  parentId?: string;
  runBy?: string;
  orchestratorProcessInstanceId?: string | null;
  status?: string | null;
  created?: string | null;
  updated?: string | null;
  input?: string | null;
  output?: string | null;
  step?: string | null;
  process?: IProcess;
  bot?: IBot;
}

export const defaultValue: Readonly<IProcessInstance> = {};

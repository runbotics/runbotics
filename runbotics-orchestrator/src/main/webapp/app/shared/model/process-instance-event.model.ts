import dayjs from 'dayjs';
import { IProcessInstance } from 'app/shared/model/process-instance.model';

export interface IProcessInstanceEvent {
  id?: number;
  created?: string | null;
  log?: string | null;
  step?: string | null;
  processInstance?: IProcessInstance | null;
}

export const defaultValue: Readonly<IProcessInstanceEvent> = {};

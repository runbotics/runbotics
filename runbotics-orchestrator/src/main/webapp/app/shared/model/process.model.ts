import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

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
  executionInfo?: string | null;
  successExecutionsCount?: number | null;
  failureExecutionsCount?: number | null;
  createdBy?: IUser | null;
}

export const defaultValue: Readonly<IProcess> = {
  isPublic: false,
};

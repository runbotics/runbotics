import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IGlobalVariable {
  id?: number;
  name?: string | null;
  description?: string | null;
  type?: string | null;
  value?: string | null;
  lastModified?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IGlobalVariable> = {};

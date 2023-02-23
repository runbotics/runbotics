import { IProcess } from "./process.model";
import { IUser } from './user.model';

export interface IScheduleProcess {
    id?: number;
    cron?: string;
    process?: IProcess | null;
    user?: IUser;
}

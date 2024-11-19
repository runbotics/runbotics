import { IProcess } from "./process.model";
import { User } from './user.model';

export interface IScheduleProcess {
    id?: number;
    cron?: string;
    process?: IProcess | null;
    user?: User;
    inputVariables?: string;
}

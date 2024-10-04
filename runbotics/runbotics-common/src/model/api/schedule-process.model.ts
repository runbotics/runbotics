import { IProcess } from "./process.model";
import { UserDto } from './user.model';

export interface IScheduleProcess {
    id?: number;
    cron?: string;
    process?: IProcess | null;
    user?: UserDto;
    inputVariables?: string;
}

import { IProcess } from "./process.model";
import { IUser } from "./user.model";

export interface NotificationProcess {
    id: number;
    userId: number;
    processId: number;
    user: IUser;
    process: IProcess;
    type: string;
    createdAt: string;
}

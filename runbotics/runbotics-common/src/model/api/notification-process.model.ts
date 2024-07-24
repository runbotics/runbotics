import { NotificationProcessType } from "./notification-type.model";
import { IProcess } from "./process.model";
import { IUser } from "./user.model";

export interface NotificationProcess {
    id: number;
    user: IUser;
    process: IProcess;
    type: NotificationProcessType;
    createdAt: string;
}

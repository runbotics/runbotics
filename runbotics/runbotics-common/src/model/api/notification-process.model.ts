import { NotificationProcessType } from "./notification-type.model";
import { IProcess } from "./process.model";
import { IUser } from "./user.model";

export interface NotificationProcess {
    id: string;
    user: IUser;
    type: NotificationProcessType;
    createdAt: string;
}

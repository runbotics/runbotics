import { Notification } from "../../notifications";
import { IProcess } from "./process.model";
import { IUser } from "./user.model";

export interface NotificationProcess {
    id: number;
    user: IUser;
    process: IProcess;
    type: Notification.PROCESS_ERROR;
    createdAt: string;
}

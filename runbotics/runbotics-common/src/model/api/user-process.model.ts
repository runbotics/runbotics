import { IProcess } from "./process.model";
import { IUser } from "./user.model";

export interface UserProcess {
    userId: number;
    processId: number;
    user: IUser;
    process: IProcess;
    subscribedAt: string;
}

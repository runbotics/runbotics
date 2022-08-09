import { IScheduleProcess } from 'src/types/model/schedule-process.model';

export interface ScheduleProcessState {
    loading: boolean;
    byId: Record<string, IScheduleProcess>;
    allIds: string[];
    schedules: IScheduleProcess[];
}

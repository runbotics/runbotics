import { IScheduleProcess } from '#src-app/types/model/schedule-process.model';

export interface ScheduleProcessState {
    loading: boolean;
    schedules: IScheduleProcess[];
}

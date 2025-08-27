import { IScheduleProcess } from '#src-app/types/model/schedule-process.model';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';

const SCHEDULE_PROCESS_PATH = 'schedule-processes';

export const scheduleProcess = ApiTenantResource
    .post<IScheduleProcess, IScheduleProcess>('scheduleProcess/scheduleProcess', SCHEDULE_PROCESS_PATH);

export const getSchedulesByProcess = ApiTenantResource
    .get<IScheduleProcess[]>('scheduleProcess/getSchedulesByProcess', `${SCHEDULE_PROCESS_PATH}/processes`);

export const removeScheduledProcess = ApiTenantResource
    .delete<void>('scheduleProcess/removeScheduledProcess', SCHEDULE_PROCESS_PATH);

export const updateActiveFlagScheduledProcess = ApiTenantResource
    .patch<void>('scheduleProcess/setScheduleActive', `${SCHEDULE_PROCESS_PATH}`)


import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
} from 'runbotics-common';

import { RootState } from '#src-app/store';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import Axios from '#src-app/utils/axios';
import { Page } from '#src-app/utils/types/page';

const PROCESS_INSTANCE_EVENT_PAGE_PATH = 'process-instance-events/GetPage';

export const getProcessInstanceEvents = ApiTenantResource
    .get<Page<IProcessInstanceEvent>>(
        'processInstanceEvent/getBotProcessInstanceEvents',
        PROCESS_INSTANCE_EVENT_PAGE_PATH,
    );

export const getProcessInstanceLoopEvents = createAsyncThunk<
    IProcessInstanceLoopEvent[],
    {
        loopId: string;
        nestedIteration?: number;
        loopLabel?: string;
    },
    {
        state: RootState;
    }
>('processInstanceEvent/getBotProcessInstanceLoopEvents', ({ loopId }, { getState }) => {
    const { auth: { user } } = getState();
    return Axios.get<IProcessInstanceLoopEvent[]>(
        `/api/scheduler/tenants/${user.tenant.id}/process-instance-loop-events/${loopId}`
    ).then((response) => response.data);
}
);

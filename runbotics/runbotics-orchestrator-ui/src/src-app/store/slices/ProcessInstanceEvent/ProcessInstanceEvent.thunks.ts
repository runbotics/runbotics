import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
} from 'runbotics-common';

import Axios from '#src-app/utils/axios';

export const getProcessInstanceEvents = createAsyncThunk<
    IProcessInstanceEvent[],
    { processInstanceId: string }
>('processInstanceEvent/getBotProcessInstanceEvents', ({ processInstanceId }) =>
    Axios.get<IProcessInstanceEvent[]>(
        `/api/process-instance-events?processInstanceId.equals=${processInstanceId}&sort=finished&size=2000`
    ).then((response) => response.data)
);

export const getProcessInstanceLoopEvents = createAsyncThunk<
    IProcessInstanceLoopEvent[],
    {
        loopId: string;
        nestedIteration?: number;
        loopLabel?: string;
    }
>('processInstanceEvent/getBotProcessInstanceLoopEvents', ({ loopId }) =>
    Axios.get<IProcessInstanceLoopEvent[]>(
        `/api/process-instance-loop-events/${loopId}`
    ).then((response) => response.data)
);

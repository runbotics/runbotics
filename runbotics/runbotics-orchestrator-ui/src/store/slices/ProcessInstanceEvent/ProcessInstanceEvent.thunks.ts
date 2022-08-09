import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { IProcessInstanceEvent } from 'runbotics-common';

export const getProcessInstanceEvents = createAsyncThunk<IProcessInstanceEvent[], { processInstanceId: string }>(
    'processInstanceEvent/getBotProcessInstanceEvents',
    ({ processInstanceId }) => Axios.get<IProcessInstanceEvent[]>(
        `/api/process-instance-events?processInstanceId.equals=${processInstanceId}&sort=finished&size=2000`,
    )
        .then((response) => response.data),
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProcessOutput } from 'runbotics-common/dist/model/api/process-output.model';

import axios from '#src-app/utils/axios';

export const getAll = createAsyncThunk(
    'processOutput/getAll',
    () => axios.get<ProcessOutput[]>('/api/scheduler/process-outputs')
        .then((response) => response.data),
);

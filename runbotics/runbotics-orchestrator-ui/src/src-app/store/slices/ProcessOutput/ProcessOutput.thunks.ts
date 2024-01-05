import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProcessOutput } from 'runbotics-common/dist/model/api/process-output.model';

export const getAll = createAsyncThunk(
    'processOutput/getAll',
    () => axios.get<ProcessOutput[]>('/api/process-outputs')
        .then((response) => response.data),
);

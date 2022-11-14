import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IBotSystem } from 'runbotics-common';

export const getAll = createAsyncThunk<IBotSystem[], void>(
    'botSystems/getAll',
    () => axios.get<IBotSystem[]>('/api/bot-systems')
        .then((response) => response.data),
);

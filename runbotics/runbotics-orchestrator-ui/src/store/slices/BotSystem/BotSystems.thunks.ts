import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBotSystem } from 'runbotics-common';
import axios from 'axios';

export const getAll = createAsyncThunk<IBotSystem[], void>(
    'botSystems/getAll',
    () => axios.get<IBotSystem[]>('/api/bot-systems')
        .then((response) => response.data),
);
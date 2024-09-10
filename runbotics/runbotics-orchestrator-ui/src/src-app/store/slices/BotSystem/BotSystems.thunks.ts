import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBotSystem } from 'runbotics-common';

import axios from '#src-app/utils/axios';

export const getAll = createAsyncThunk<IBotSystem[], void>(
    'botSystems/getAll',
    () => axios.get<IBotSystem[]>('/api/bot-systems')
        .then((response) => response.data),
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from 'runbotics-common';

export const getAll = createAsyncThunk<IUser[], void>(
    'users/getAll',
    () => axios.get<IUser[]>('/api/admin/users')
        .then((response) => response.data),
);

export const getAllLimited = createAsyncThunk<IUser[], void>(
    'users/getAll',
    () => axios.get<IUser[]>('/api/admin/users/limited')
        .then((response) => response.data),
);

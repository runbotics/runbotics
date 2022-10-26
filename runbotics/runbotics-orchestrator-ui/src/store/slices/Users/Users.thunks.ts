import { IUser } from 'runbotics-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

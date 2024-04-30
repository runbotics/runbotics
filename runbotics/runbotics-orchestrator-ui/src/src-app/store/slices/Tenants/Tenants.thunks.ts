import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tenant } from 'runbotics-common';

export const getAll = createAsyncThunk<Tenant[], void>(
    'tenants/getAll',
    () => axios.get<Tenant[]>('/api/admin/tenants/all')
        .then(response => response.data)
);

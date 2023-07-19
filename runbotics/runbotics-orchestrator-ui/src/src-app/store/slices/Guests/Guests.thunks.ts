import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

import { Guest } from '#src-app/types/guest';

export const getGuestExecutionCount = createAsyncThunk<Guest, { userId: string }>(
    'guests/getGuestExecutionCount',
    async (payload: { userId: string }, { rejectWithValue }) => {
        try {
            const response = await Axios.get<Guest>(`/api/guests/${payload.userId}`);
            const guest = response.data;
            return { ...guest };
        } catch (error) {
            if (!error.response) {
                throw error;
            }

            return rejectWithValue(error.response.data);
        }
    }
);

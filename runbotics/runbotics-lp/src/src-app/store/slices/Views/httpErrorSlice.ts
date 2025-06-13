import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../index';

interface HttpErrorState {
    code: number | null;
    title: string | null;
    message: string | null;
}

const initialState: HttpErrorState = {
    code: null,
    title: null,
    message: null,
};

const httpErrorSlice = createSlice({
    name: 'httpError',
    initialState,
    reducers: {
        setErrorCode: (state, action: PayloadAction<number>) => {
            state.code = action.payload;
        },
        setCustomError: (state, action: PayloadAction<{ title: string; message: string }>) => {
            state.title = action.payload.title;
            state.message = action.payload.message;
        },
        clearError: (state) => {
            state.code = null;
            state.title = null;
            state.message = null;
        },
    },
});

export const { setErrorCode, setCustomError, clearError } = httpErrorSlice.actions;

export const httpErrorReducer = httpErrorSlice.reducer;

export const httpErrorSelector = (state: RootState) => state.httpErrorReducer;

export default httpErrorReducer;

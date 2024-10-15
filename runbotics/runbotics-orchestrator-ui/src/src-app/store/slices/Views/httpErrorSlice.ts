import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
        setCustomError: (state, action: PayloadAction<{ title: string; message: string }>) => {
            state.code = null;
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

export const { setCustomError, clearError } = httpErrorSlice.actions;

export const httpErrorReducer = httpErrorSlice.reducer;

export default httpErrorReducer;

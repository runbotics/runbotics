import { createAsyncThunk } from '@reduxjs/toolkit';

import Axios, { AxiosError } from 'axios';

import { AppDispatch, RootState } from 'src/store';
import { IAction } from 'src/types/model/action.model';

export const getActions = createAsyncThunk('actions/getActions', async () => {
    const response = await Axios.get<IAction[]>('/api/actions');
    return response.data;
});

export const setShowEditModal = createAsyncThunk(
    'actions/setShowEditModal',
    (payload: { show: boolean; action?: IAction }) => payload,
);

export const saveAction = createAsyncThunk<
    IAction,
    IAction,
    {
        state: RootState;
        requestId: string;
        rejectWithValue: any;
        dispatch: AppDispatch;
    }
>('actions/save', async (action, {
    rejectWithValue, dispatch,
}) => {
    try {
        if (action.id) {
            const response = await Axios.put<IAction>(`/api/actions/${action.id}`, action);
            dispatch(getActions());
            return response.data;
        }
        const response = await Axios.post<IAction>('/api/actions', { ...action, id: action.script });
        dispatch(getActions());
        return response.data;
    } catch (err) {
        const error: AxiosError<any> = err; // cast the error for access
        if (!error.response) 
        { throw err; }
        
        // We got validation errors, let's return those so we can reference in our component and set form errors
        return rejectWithValue(error.response.data);
    }
});

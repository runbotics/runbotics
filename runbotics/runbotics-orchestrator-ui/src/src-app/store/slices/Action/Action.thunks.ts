import { createAsyncThunk } from '@reduxjs/toolkit';

import { IAction } from '#src-app/types/model/action.model';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';

const ACTIONS_PATH = 'actions';

export const getAllActions = ApiTenantResource.get<IAction[]>('actions/getAll', ACTIONS_PATH);

export const createAction = ApiTenantResource.post<IAction, IAction>('action/create', ACTIONS_PATH);

export const updateAction = ApiTenantResource.patch<IAction, IAction>('action/update', ACTIONS_PATH);

export const deleteAction = ApiTenantResource.delete<void>('action/delete', ACTIONS_PATH);

export const setShowEditModal = createAsyncThunk(
    'actions/setShowEditModal',
    (payload: { show: boolean; action?: IAction }) => payload,
);

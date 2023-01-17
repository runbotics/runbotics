/* eslint-disable no-duplicate-imports */
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import type { Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import type { ThunkAction } from 'redux-thunk';

import { ENABLE_REDUX_DEV_TOOLS } from '#src-app/utils/constants';

import rootReducer from './rootReducer';

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
});

const store = configureStore({
    reducer: rootReducer,
    devTools: ENABLE_REDUX_DEV_TOOLS,
    middleware: customizedMiddleware,
});

store.subscribe(() => {
    localStorage.setItem('state', JSON.stringify({}));
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;

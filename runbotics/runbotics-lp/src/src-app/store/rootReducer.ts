import { combineReducers } from '@reduxjs/toolkit';
import { authReducer as auth } from './slices/Auth/index';
import httpErrorReducer from './slices/Views/httpErrorSlice';

const rootReducer = combineReducers({
    auth,
    httpErrorReducer
});

export default rootReducer;

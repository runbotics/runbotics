import { combineReducers } from '@reduxjs/toolkit';

import httpErrorReducer from './slices/Views/httpErrorSlice';

const rootReducer = combineReducers({
    httpErrorReducer
});

export default rootReducer;

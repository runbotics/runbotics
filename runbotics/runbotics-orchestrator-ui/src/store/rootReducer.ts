import { combineReducers } from '@reduxjs/toolkit';
import { reducer as form } from 'redux-form';
import { processReducer as process } from './slices/Process';
import { actionReducer as action } from './slices/Action/index';
import { authReducer as auth } from './slices/Auth/index';
import { globalVariableReducer as globalVariable } from './slices/GlobalVariable';
import { botReducer as bot } from './slices/Bot';
import { botCollectionReducer as botCollection } from './slices/BotCollections';
import { botSystemsReducer as botSystem } from './slices/BotSystem';
import { activityReducer as activity } from './slices/Activity';
import { processInstanceReducer as processInstance } from './slices/ProcessInstance';
import { processInstanceEventReducer as processInstanceEvent } from './slices/ProcessInstanceEvent';
import { scheduleProcessReducer as scheduleProcess } from './slices/ScheduleProcess';
import { schedulerReducer as scheduler } from './slices/Scheduler';
import { usersReducer as users } from './slices/Users';

const rootReducer = combineReducers({
    action,
    activity,
    auth,
    bot,
    botCollection,
    botSystem,
    form,
    globalVariable,
    process,
    processInstance,
    processInstanceEvent,
    scheduleProcess,
    scheduler,
    users,
});

export default rootReducer;
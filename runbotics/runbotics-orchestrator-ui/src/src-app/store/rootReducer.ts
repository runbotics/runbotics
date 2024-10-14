import { combineReducers } from '@reduxjs/toolkit';
import { reducer as form } from 'redux-form';

import { actionReducer as action } from './slices/Action/index';
import { activityReducer as activity } from './slices/Activity';
import { authReducer as auth } from './slices/Auth/index';
import { botReducer as bot } from './slices/Bot';
import { botCollectionReducer as botCollection } from './slices/BotCollections';
import { botSystemsReducer as botSystem } from './slices/BotSystem';
import { credentialCollectionsReducer as credentialCollections} from './slices/CredentialCollections';
import { credentialsReducer as credentials } from './slices/Credentials';
import { credentialTemplatesReducer as credentialTemplates } from './slices/CredentialTemplates';
import { globalVariableReducer as globalVariable } from './slices/GlobalVariable';
import { guestsReducer as guests } from './slices/Guests';
import httpErrorReducer from './slices/Views/httpErrorSlice';
import { processCollectionReducer as processCollection } from './slices/ProcessCollection';
import { processInstanceReducer as processInstance } from './slices/ProcessInstance';
import { processInstanceEventReducer as processInstanceEvent } from './slices/ProcessInstanceEvent';
import { processOutputReducer as processOutput } from './slices/ProcessOutput';
import { scheduleProcessReducer as scheduleProcess } from './slices/ScheduleProcess';
import { schedulerReducer as scheduler } from './slices/Scheduler';
import { tenantsReducer as tenants } from './slices/Tenants';
import { usersReducer as users } from './slices/Users';
import { processReducer as process } from './slices/Process';

const rootReducer = combineReducers({
    action,
    activity,
    auth,
    bot,
    botCollection,
    botSystem,
    form,
    globalVariable,
    guests,
    httpErrorReducer,
    process,
    processCollection,
    processInstance,
    processInstanceEvent,
    scheduleProcess,
    scheduler,
    users,
    processOutput,
    tenants,
    credentials,
    credentialCollections,
    credentialTemplates,
});

export default rootReducer;

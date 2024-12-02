import { Role } from 'runbotics-common';

import { Mixpanel } from './Mixpanel';
import {
    RecordClick,
    RecordFailedLogin,
    RecordFailedRegistration,
    RecordPageEntrance,
    RecordProcessRunFail,
    RecordProcessRunSuccess,
    RecordSuccessfulAuthentication,
    TRACK_LABEL,
    USER_TYPE,
    ENTERED_PAGE,
    RecordProcessSaveSuccess,
    RecordProcessSaveFail
} from './types';

// EVENTS - Sign in and Sign up

export const recordSuccessfulAuthentication = ({
    identifyBy,
    userType,
    sourcePage,
    email,
    trackLabel
}: RecordSuccessfulAuthentication): void => {
    Mixpanel.identify(identifyBy);
    Mixpanel.track(trackLabel, { userType, sourcePage });
    Mixpanel.people.set({
        $email: email,
        $name: email.split('@')[0],
    });
};

export const recordFailedLogin = ({
    trackLabel,
    sourcePage,
    reason,
    userType = USER_TYPE.UNKNOWN
}: RecordFailedLogin): void => {
    Mixpanel.track(trackLabel, { sourcePage, reason, userType });
};

export const recordFailedRegistration = ({
    trackLabel,
    sourcePage,
    reason,
    userType
}: RecordFailedRegistration): void => {
    Mixpanel.track(trackLabel, { sourcePage, reason, userType });
};

// EVENTS - Modeler

export const recordProcessSaveSuccess = ({ processName, processId }: RecordProcessSaveSuccess): void => {
    Mixpanel.track(TRACK_LABEL.PROCESS_SAVE_SUCCESS, { processName, processId });
};

export const recordProcessSaveFail = ({ processName, processId, reason }: RecordProcessSaveFail): void => {
    Mixpanel.track(TRACK_LABEL.PROCESS_SAVE_FAIL, { processName, processId, reason });
};

export const recordProcessRunSuccess = ({ processName, processId, processInstanceId }: RecordProcessRunSuccess): void => {
    Mixpanel.track(TRACK_LABEL.PROCESS_RUN_SUCCESS, { processName, processId, processInstanceId });
};

export const recordProcessRunFail = ({ processName, processId, reason }: RecordProcessRunFail): void => {
    Mixpanel.track(TRACK_LABEL.PROCESS_RUN_FAIL, { processName, processId, reason });
};

// EVENTS - Other

export const recordPageEntrance = ({ enteredPage }: RecordPageEntrance): void => {
    Mixpanel.track(TRACK_LABEL.PAGE_ENTER, { enteredPage });
};

export const recordItemClick = ({ sourcePage, itemName, extraProperties = {} }: RecordClick): void => {
    Mixpanel.track(TRACK_LABEL.ITEM_CLICK, { sourcePage, itemName, ...extraProperties });
};
// GENERAL

export const identifyUserType = (userAuthorities: string[]): USER_TYPE => {
    if(userAuthorities.includes(Role.ROLE_ADMIN)) return USER_TYPE.ADMIN;
    if (userAuthorities.includes(Role.ROLE_TENANT_ADMIN)) return USER_TYPE.TENANT_ADMIN;
    else if (userAuthorities.includes(Role.ROLE_USER)) return USER_TYPE.USER;
    else if (userAuthorities.includes(Role.ROLE_GUEST)) return USER_TYPE.GUEST;
    else if (userAuthorities.includes(Role.ROLE_EXTERNAL_USER)) return USER_TYPE.EXTERNAL_USER;
    return USER_TYPE.UNKNOWN;
};

export const identifyPageByUrl = (path: string): ENTERED_PAGE => {
    if (path.includes('/blog')) return ENTERED_PAGE.BLOG;
    else if (path === '/') return ENTERED_PAGE.LANDING;
    return ENTERED_PAGE.NOT_SPECIFIED;
};

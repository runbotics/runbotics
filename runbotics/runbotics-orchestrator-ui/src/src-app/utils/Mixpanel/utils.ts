import { Role } from 'runbotics-common';

import { Mixpanel } from './Mixpanel';
import { RecordFailedLogin, RecordFailedRegistration, RecordSuccessfulLogin, RecordSuccessfulRegistration, UserType } from './types';

export const mixpanelRecordSuccessfulLogin = ({ identifyBy, userType, page, email, userName, trackLabel: trackLabel }: RecordSuccessfulLogin): void => {
    Mixpanel.identify(identifyBy);
    Mixpanel.track(trackLabel, { userType, page });
    Mixpanel.people.set({
        $email: email,
        $name: userName,
    });
};

export const mixpanelRecordFailedLogin = ({ trackLabel, page, reason, userType = UserType.UNKNOWN }: RecordFailedLogin): void => {
    Mixpanel.track(trackLabel, { page, reason, userType});
};

export const mixpanelRecordSuccessfulRegistration = ({ identifyBy, userType, page, email, trackLabel }: RecordSuccessfulRegistration): void => {
    Mixpanel.identify(identifyBy);
    Mixpanel.track(trackLabel, { userType, page });
    Mixpanel.people.set({
        $email: email,
        $name: email.split('@')[0],
    });
};

export const mixpanelRecordFailedRegistration = ({ trackLabel, page, reason, userType }: RecordFailedRegistration): void => {
    Mixpanel.track(trackLabel, { page, reason, userType});
};

export const identifyUserType = (userAuthorities: string[]): UserType => {
    if(userAuthorities.includes(Role.ROLE_ADMIN)) return UserType.ADMIN;
    else if (userAuthorities.includes(Role.ROLE_USER)) return UserType.USER;
    else if (userAuthorities.includes(Role.ROLE_GUEST)) return UserType.GUEST;
    else if (userAuthorities.includes(Role.ROLE_EXTERNAL_USER)) return UserType.EXTERNAL_USER;
    return UserType.UNKNOWN;
};

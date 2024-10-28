import { IUser } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface UsersState {
    all: IUser[];
    loading: boolean;
    userUpdate: {
        loading: boolean
    };
    userDelete: {
        loading: boolean;
    };
    activated: {
        loading: boolean;
        all: IUser[];
        allByPage: Page<IUser> | null;
        nonAdmins: {
            all: IUser[];
            loading: boolean;
        };
    };
    notActivated: {
        loading: boolean;
        all: IUser[];
        allByPage: Page<IUser> | null;
    };
    tenantActivated: {
        loading: boolean;
        all: IUser[];
        allByPage: Page<IUser> | null;
    };
    tenantNotActivated: {
        loading: boolean;
        all: IUser[];
        allByPage: Page<IUser> | null;
    };
}

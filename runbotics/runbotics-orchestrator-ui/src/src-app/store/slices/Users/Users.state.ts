import { IUser } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface UsersState {
    loading: boolean;
    userUpdate: {
        loading: boolean
    };
    all: IUser[];
    notActivated: {
        loading: boolean;
        all: IUser[];
        allByPage: Page<IUser> | null;
    }
}

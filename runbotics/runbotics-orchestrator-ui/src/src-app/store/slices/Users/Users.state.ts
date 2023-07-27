import { IUser } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface UsersState {
    loading: boolean;
    userUpdate: {
        loading: boolean
    };
    all: IUser[];
    allNotActivated: IUser[];
    allNotActivatedByPage: Page<IUser> | null;
}

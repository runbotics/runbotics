import { UserDto } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface UsersState {
    all: UserDto[];
    loading: boolean;
    userUpdate: {
        loading: boolean
    };
    userDelete: {
        loading: boolean;
    };
    activated: {
        loading: boolean;
        all: UserDto[];
        allByPage: Page<UserDto> | null;
        nonAdmins: {
            all: UserDto[];
            loading: boolean;
        };
    };
    notActivated: {
        loading: boolean;
        all: UserDto[];
        allByPage: Page<UserDto> | null;
    };
    tenantActivated: {
        loading: boolean;
        all: UserDto[];
        allByPage: Page<UserDto> | null;
    };
    tenantNotActivated: {
        loading: boolean;
        all: UserDto[];
        allByPage: Page<UserDto> | null;
    };
}

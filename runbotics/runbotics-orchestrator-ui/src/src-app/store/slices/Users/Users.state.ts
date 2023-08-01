import { IUser } from 'runbotics-common';

export interface UsersState {
    loading: boolean;
    userUpdate: {
        loading: boolean
    };
    all: IUser[];
}

import { IUser } from 'runbotics-common';

export interface UsersState {
    loading: boolean;
    all: IUser[];
}

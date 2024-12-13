import { UserDto } from 'runbotics-common';

export interface SelectedTenants { [id:number]: string };

export const getSelectedTenants = (users: UserDto[]): SelectedTenants => {
    if (!users) return {};

    const usersTenant = users.reduce((acc, currentUser) => {
        acc[currentUser.id] = currentUser.tenant.id;

        return acc;
    }, {});

    return usersTenant;
};

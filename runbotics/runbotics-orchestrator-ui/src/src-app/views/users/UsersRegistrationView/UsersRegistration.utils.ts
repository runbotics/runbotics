import { UserDto } from 'runbotics-common';

export interface CombinedUserWithTenant { [id:number]: string };

export const getCombinedUserWithTenantIds = (users: UserDto[]): CombinedUserWithTenant => {
    if (!users) return {};

    const usersTenant = users.reduce((acc, currentUser) => {
        acc[currentUser.id] = currentUser.tenant.id;

        return acc;
    }, {});

    return usersTenant;
};

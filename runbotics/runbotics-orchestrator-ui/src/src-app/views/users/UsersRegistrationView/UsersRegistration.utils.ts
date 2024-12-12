import { UserDto } from 'runbotics-common';

export const getSelectedTenants = (users: UserDto[]) => {
    if (!users) return {};

    const usersTenant = users.reduce((acc, currentUser) => {
        acc[currentUser.id] = currentUser.tenant.id;

        return acc;
    }, {});

    return usersTenant;
};

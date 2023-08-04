import { Role } from 'runbotics-common';

export enum UserField {
    EMAIL = 'email',
    CREATED_DATE = 'createdDate',
    ROLE = 'role',
};

export const formatUserRole = (role: Role) => role.split('_').slice(1).join(' ');

export const getAllUserRoles = (): Role[] => Object.values(Role);

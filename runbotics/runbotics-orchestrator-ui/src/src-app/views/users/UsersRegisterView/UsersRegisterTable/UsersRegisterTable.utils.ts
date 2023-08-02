import { Role } from 'runbotics-common';

export const createDateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};

export enum UserField {
    EMAIL = 'email',
    CREATED_DATE = 'createdDate',
    ROLE = 'role',
};

export const formatUserRole = (role: string) => role.split('_').slice(1).join(' ');

export const getKeysFromRoleEnum = () => Object.keys(Role) as (keyof typeof Role)[];

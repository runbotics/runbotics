import { Role } from 'runbotics-common';

export const formatUserRole = (role: string) => role.split('_').slice(1).join(' ');

export const getKeysFromRoleEnum = () => Object.keys(Role) as (keyof typeof Role)[];

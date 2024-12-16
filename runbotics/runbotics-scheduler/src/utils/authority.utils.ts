import { Role } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';

export const isTenantAdmin = (user: User) => user.authorities.some(authority => authority.name === Role.ROLE_TENANT_ADMIN);

export const isAdmin = (user: User) => user.authorities.some(authority => authority.name === Role.ROLE_ADMIN);

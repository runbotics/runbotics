import { Role } from 'runbotics-common';
import { UserEntity } from '#/database/user/user.entity';

export const isTenantAdmin = (user: UserEntity) => user.authorities.some(authority => authority.name === Role.ROLE_TENANT_ADMIN);

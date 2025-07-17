import { PrivilegeType } from 'runbotics-common';

export class AddProcessCollectionUserDto {
    privilegeType: PrivilegeType;
    userId?: number;
    collectionId: string;
}

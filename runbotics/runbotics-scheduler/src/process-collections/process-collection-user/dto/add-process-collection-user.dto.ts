import { PrivilegeType } from 'runbotics-common';

export class AddProcessCollectionUserDto {
    privilegeType: PrivilegeType;
    collectionId: number;
}

import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';
import { ACTION_GROUP } from 'runbotics-common';

@Entity({ schema: 'scheduler' })
export class ActionBlacklist {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column({ type: 'enum', enum: ACTION_GROUP, array: true, nullable: true })
    actionGroups: ACTION_GROUP[];
}

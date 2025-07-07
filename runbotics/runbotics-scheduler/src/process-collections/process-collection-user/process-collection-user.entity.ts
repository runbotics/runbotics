import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PrivilegeType } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessCollection } from '../process-collection/process-collection.entity';

@Entity({ schema: 'scheduler' })
@Index(['userId', 'processCollectionId'], { unique: true })
export class ProcessCollectionUser {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ type: 'enum', enum: PrivilegeType })
    privilege_type: PrivilegeType;

    @ManyToOne(() => User, (user) => user.processCollectionPrivileges, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int' })
    userId: number;

    @ManyToOne(
        () => ProcessCollection,
        (processCollection) => processCollection.processCollectionPrivileges,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'processCollectionId' })
    processCollection: ProcessCollection;

    @Column()
    processCollectionId: string;
}

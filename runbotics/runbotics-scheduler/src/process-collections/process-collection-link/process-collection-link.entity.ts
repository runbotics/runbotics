import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProcessCollection } from '../process-collection/process-collection.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { dateTransformer } from '#/database/database.utils';

@Entity({ schema: 'scheduler' })
export class ProcessCollectionLink {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @ManyToOne(() => ProcessCollection,
        (processCollection) => processCollection.processCollectionLinks,
        {onDelete: 'CASCADE', onUpdate: 'CASCADE', cascade: true})
    @JoinColumn({ name: 'collectionId' })
    collection: ProcessCollection;

    @PrimaryColumn()
    collectionId: number;

    @Column({ type: 'uuid' })
    @Generated('uuid')
    token: string;

    @ManyToOne(() => User, (user) => user.sharedCollections)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn({ type: 'timestamp', transformer: dateTransformer })
    createdAt: Date;

}

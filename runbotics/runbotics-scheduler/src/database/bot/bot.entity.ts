import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    Generated,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import {
    BotStatus,
    IBot,
    IUser,
    IBotCollection,
    IBotSystem,
} from 'runbotics-common';
import { BotCollectionEntity } from '../bot-collection/bot-collection.entity';
import { BotSystemEntity } from '../bot-system/bot-system.entity';
import { dateTransformer, numberTransformer } from '../database.utils';

@Entity({ name: 'bot', synchronize: false })
export class BotEntity implements IBot {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    id: number;

    @Column({ transformer: dateTransformer, type: 'varchar' })
    created: string;

    @Column({ name: 'installation_id', unique: true, type: 'varchar' })
    installationId: string;

    @Column({ name: 'last_connected', transformer: dateTransformer, type: 'varchar' })
    lastConnected: string;

    @Column({ enum: BotStatus, type: 'enum' })
    status: BotStatus;

    @Column({ type: 'varchar' })
    version: string;

    @ManyToOne(() => BotSystemEntity)
    @JoinColumn([{ name: 'system', referencedColumnName: 'name' }])
    system: IBotSystem;

    @ManyToOne(() => UserEntity)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: IUser;

    @ManyToOne(() => BotCollectionEntity)
    @JoinColumn([{ name: 'collection_id', referencedColumnName: 'id' }])
    collection: IBotCollection;

    @ManyToMany(() => UserEntity)
    @JoinTable({
        name: 'notification_bot',
        joinColumn: { name: 'bot_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    subscribers: IUser[];
}

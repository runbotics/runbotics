import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    Generated,
    OneToMany,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import {
    BotStatus,
    IBot,
    IUser,
    IBotCollection,
    IBotSystem,
    NotificationBot,
} from 'runbotics-common';
import { BotCollectionEntity } from '../bot-collection/bot-collection.entity';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { dateTransformer, numberTransformer } from '../database.utils';
import { NotificationBot as NotificationBotEntity } from '#/scheduler-database/notification-bot/notification-bot.entity';

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

    @ManyToOne(() => BotSystem)
    @JoinColumn([{ name: 'system', referencedColumnName: 'name' }])
    system: IBotSystem;

    @ManyToOne(() => UserEntity)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: IUser;

    @ManyToOne(() => BotCollectionEntity)
    @JoinColumn([{ name: 'collection_id', referencedColumnName: 'id' }])
    collection: IBotCollection;

    @OneToMany(() => NotificationBotEntity, (notificationBot) => notificationBot.bot)
    @JoinColumn({ name: 'bot_id', referencedColumnName: 'id' })
    notifications: NotificationBot[];
}

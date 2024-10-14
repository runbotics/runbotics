import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    Generated,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import {
    BotStatus,
    IBot,
    IUser,
    IBotCollection,
    NotificationBot,
} from 'runbotics-common';
import { BotCollectionEntity } from '../bot-collection/bot-collection.entity';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { dateTransformer, numberTransformer } from '../database.utils';
import { NotificationBot as NotificationBotEntity } from '#/scheduler-database/notification-bot/notification-bot.entity';

@Entity({ name: 'bot' })
export class BotEntity implements IBot {
    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;
    
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    id: number;

    @CreateDateColumn({ transformer: dateTransformer, type: 'timestamp without time zone' })
    created: string;

    @Column({ name: 'installation_id', unique: true, type: 'varchar', length: 255 })
    installationId: string;

    @Column({ name: 'last_connected', transformer: dateTransformer, type: 'timestamp without time zone' })
    lastConnected: string;

    @Column({ type: 'varchar', length: 50 })
    status: BotStatus;

    @Column({ type: 'varchar', length: 20 })
    version: string;

    @ManyToOne(() => BotSystem)
    @JoinColumn({ name: 'system' })
    system: BotSystem;

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

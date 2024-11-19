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
import { User } from '#/scheduler-database/user/user.entity';
import {
    BotStatus,
    IBot,
    NotificationBot,
    BotSystemType,
} from 'runbotics-common';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { dateTransformer, numberTransformer } from '#/database/database.utils';
import {
    NotificationBot as NotificationBotEntity,
} from '#/scheduler-database/notification-bot/notification-bot.entity';
import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';

@Entity({ name: 'bot' })
export class BotEntity implements IBot {
    @Column({
        name: 'tenant_id',
        type: 'uuid',
        nullable: false,
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;

    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    id: number;

    @CreateDateColumn({ transformer: dateTransformer, type: 'timestamp without time zone', nullable: true })
    created: string;

    @Column({ name: 'installation_id', unique: true, type: 'varchar', length: 255 })
    installationId: string;

    @Column({
        name: 'last_connected',
        transformer: dateTransformer,
        type: 'timestamp without time zone',
        nullable: true,
    })
    lastConnected: string;

    @Column({ type: 'varchar', length: 50, default: BotStatus.DISCONNECTED, nullable: true })
    status: BotStatus;

    @Column({ type: 'varchar', length: 20, nullable: true })
    version: string;

    @ManyToOne(() => BotSystem, { nullable: true })
    @JoinColumn({ name: 'system' })
    system: BotSystem;

    @Column({ name: 'system', default: BotSystemType.LINUX, length: 50 })
    systemName: BotSystemType;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User;

    @ManyToOne(() => BotCollection, { nullable: false })
    @JoinColumn([{ name: 'collection_id', referencedColumnName: 'id' }])
    collection: BotCollection;

    @Column({ name: 'collection_id' })
    collectionId: string;

    @OneToMany(() => NotificationBotEntity, (notificationBot) => notificationBot.bot)
    @JoinColumn({ name: 'bot_id', referencedColumnName: 'id' })
    notifications: NotificationBot[];
}

import { IBot, IUser, Notification, NotificationBot } from 'runbotics-common';
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { dateTransformer, numberTransformer } from '../database.utils';
import { UserEntity } from '../user/user.entity';
import { BotEntity } from '../bot/bot.entity';

@Entity({ name: 'notification_bot' })
export class NotificationBotEntity implements NotificationBot {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: IUser;

    @ManyToOne(() => BotEntity)
    @JoinColumn([{ name: 'bot_id', referencedColumnName: 'id' }])
    bot: IBot;

    @Column()
    type: Notification.BOT_DISCONNECTED;

    @Column({ name: 'created_at', transformer: dateTransformer })
    createdAt: string;
}

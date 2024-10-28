import { NotificationBotType } from 'runbotics-common';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';
import { BotEntity } from '#/database/bot/bot.entity';


@Entity({ name: 'notification_bot' })
@Unique(['user', 'bot', 'type'])
export class NotificationBot {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ enum: NotificationBotType, default: NotificationBotType.BOT_DISCONNECTED, type: 'varchar', length: 50 })
    type: NotificationBotType;

    @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => BotEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bot_id' })
    bot: BotEntity;
}
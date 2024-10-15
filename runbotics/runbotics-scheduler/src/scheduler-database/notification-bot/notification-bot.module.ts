import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationBot } from './notification-bot.entity';
import { NotificationBotController } from './notification-bot.controller';
import { NotificationBotService } from './notification-bot.service';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';


@Module({
    imports: [TypeOrmModule.forFeature([NotificationBot, BotEntity])],
    providers: [NotificationBotService],
    controllers: [NotificationBotController],
    exports: [NotificationBotService]
})
export class NotificationBotModule {}

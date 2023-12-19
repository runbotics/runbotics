import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationBotEntity } from './notification-bot.entity';
import { NotificationBotService } from './notification-bot.service';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationBotEntity])],
    exports: [NotificationBotService],
    providers: [NotificationBotService],
})
export class NotificationBotModule {}

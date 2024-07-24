import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationBot } from './notification-bot.entity';


@Module({
    imports: [TypeOrmModule.forFeature([NotificationBot])],
    providers: [],
    exports: []
})
export class NotificationBotModule {}

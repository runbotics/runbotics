import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotEntity } from './bot.entity';
import { BotService } from './bot.service';
import { BotController } from '#/scheduler-database/bot/bot.controller';
import { BotCollectionModule } from '#/scheduler-database/bot-collection/bot-collection.module';
import { BotCrudService } from '#/scheduler-database/bot/bot-crud.service';

@Module({
    imports: [TypeOrmModule.forFeature([BotEntity]), BotCollectionModule],
    exports: [BotService, BotCrudService],
    providers: [BotService, BotCrudService],
    controllers: [BotController],
})
export class BotModule {}

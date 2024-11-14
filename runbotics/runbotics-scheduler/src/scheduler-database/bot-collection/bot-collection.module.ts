import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotCollectionService } from './bot-collection.service';
import { BotCollection } from './bot-collection.entity';
import { UserEntity } from '#/database/user/user.entity';
import { BotCollectionController } from '#/scheduler-database/bot-collection/bot-collection.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BotCollection, UserEntity])],
    exports: [BotCollectionService],
    providers: [BotCollectionService],
    controllers: [BotCollectionController],
})
export class BotCollectionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotCollectionService } from './bot-collection.service';
import { BotCollectionEntity } from './bot-collection.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BotCollectionEntity])],
    exports: [TypeOrmModule, BotCollectionService],
    providers: [BotCollectionService],
})
export class BotCollectionModule {}
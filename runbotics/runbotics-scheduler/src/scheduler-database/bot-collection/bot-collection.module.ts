import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotCollectionService } from './bot-collection.service';
import { BotCollection } from './bot-collection.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { BotCollectionController } from '#/scheduler-database/bot-collection/bot-collection.controller';
import { UserModule } from '../user/user.module';
import { ProcessEntity } from '../process/process.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BotCollection, User, ProcessEntity]), UserModule],
    exports: [BotCollectionService],
    providers: [BotCollectionService],
    controllers: [BotCollectionController],
})
export class BotCollectionModule {}

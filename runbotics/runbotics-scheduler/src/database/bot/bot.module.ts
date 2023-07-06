import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotEntity } from './bot.entity';
import { BotService } from './bot.service';

@Module({
    imports: [TypeOrmModule.forFeature([BotEntity])],
    exports: [BotService],
    providers: [BotService],
})
export class BotModule {}

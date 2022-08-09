import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotSystemEntity } from './bot_system.entity';
import { BotSystemService } from './bot_system.service';

@Module({
    imports: [TypeOrmModule.forFeature([BotSystemEntity])],
    exports: [TypeOrmModule, BotSystemService],
    providers: [BotSystemService],
})
export class BotSystemModule {}
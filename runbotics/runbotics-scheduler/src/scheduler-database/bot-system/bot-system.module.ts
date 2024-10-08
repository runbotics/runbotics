import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotSystemEntity } from './bot-system.entity';
import { BotSystemService } from './bot-system.service';

@Module({
    imports: [TypeOrmModule.forFeature([BotSystemEntity])],
    exports: [BotSystemService],
    providers: [BotSystemService],
})
export class BotSystemModule {}

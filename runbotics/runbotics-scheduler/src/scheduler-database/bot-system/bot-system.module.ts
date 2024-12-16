import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotSystem } from './bot-system.entity';
import { BotSystemService } from './bot-system.service';

@Module({
    imports: [TypeOrmModule.forFeature([BotSystem])],
    exports: [BotSystemService],
    providers: [BotSystemService],
})
export class BotSystemModule {}

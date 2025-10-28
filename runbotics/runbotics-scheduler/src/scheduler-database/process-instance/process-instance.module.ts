import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstance } from './process-instance.entity';
import { ProcessInstanceService } from './process-instance.service';
import { ProcessInstanceController } from './process-instance.controller';
import { ProcessModule } from '../process/process.module';
import { BotModule } from '../bot/bot.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstance]), ProcessModule, BotModule],
    controllers: [ProcessInstanceController],
    providers: [ProcessInstanceService],
    exports: [ProcessInstanceService],
})
export class ProcessInstanceModule {}

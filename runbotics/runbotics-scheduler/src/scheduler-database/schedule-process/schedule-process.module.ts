import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleProcess } from './schedule-process.entity';
import { QueueService } from '#/queue/queue.service';
import { ProcessService } from '#/database/process/process.service';
import { ScheduleProcessController } from './schedule-process.controller';
import { ScheduleProcessService } from './schedule-process.service';

@Module({
    imports: [TypeOrmModule.forFeature([ScheduleProcess]), QueueService, ProcessService],
    controllers: [ScheduleProcessController],
    providers: [ScheduleProcessService],
    exports: [ScheduleProcessService],
})
export class ScheduleProcessModule {}

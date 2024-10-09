import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleProcess } from './schedule-process.entity';
import { ScheduleProcessController } from './schedule-process.controller';
import { ScheduleProcessService } from './schedule-process.service';
import { QueueModule } from '#/queue/queue.module';
import { ProcessModule } from '#/scheduler-database/process/process.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ScheduleProcess]),
        ProcessModule, forwardRef(() => QueueModule)
    ],
    controllers: [ScheduleProcessController],
    providers: [ScheduleProcessService],
    exports: [ScheduleProcessService],
})
export class ScheduleProcessModule { }

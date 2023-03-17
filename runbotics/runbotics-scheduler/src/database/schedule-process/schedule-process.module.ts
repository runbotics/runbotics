import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleProcessEntity } from './schedule-process.entity';
import { ScheduleProcessService } from './schedule-process.service';

@Module({
    imports: [TypeOrmModule.forFeature([ScheduleProcessEntity])],
    providers: [ScheduleProcessService],
    exports: [ScheduleProcessService],
})
export class ScheduleProcessModule {}
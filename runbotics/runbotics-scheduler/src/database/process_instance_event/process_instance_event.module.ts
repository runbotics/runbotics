import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ProcessInstanceEventEntity} from './process_instance_event.entity';
import { ProcessInstanceEventService } from './process_instance_event.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstanceEventEntity])],
    exports: [TypeOrmModule, ProcessInstanceEventService],
    providers: [ProcessInstanceEventService],
})
export class ProcessInstanceEventModule {}
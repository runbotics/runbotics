import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstanceLoopEventEntity } from './process-instance-loop-event.entity';
import { ProcessInstanceLoopEventService } from './process-instance-loop-event.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstanceLoopEventEntity])],
    exports: [TypeOrmModule, ProcessInstanceLoopEventService],
    providers: [ProcessInstanceLoopEventService],
})
export class ProcessInstanceLoopEventModule {}

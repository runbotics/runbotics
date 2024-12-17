import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstanceLoopEvent } from './process-instance-loop-event.entity';
import { ProcessInstanceLoopEventService } from './process-instance-loop-event.service';
import { ProcessInstanceLoopEventController } from './process-instance-loop-event.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstanceLoopEvent])],
    controllers: [ProcessInstanceLoopEventController],
    providers: [ProcessInstanceLoopEventService],
    exports: [ProcessInstanceLoopEventService],
})
export class ProcessInstanceLoopEventModule {}

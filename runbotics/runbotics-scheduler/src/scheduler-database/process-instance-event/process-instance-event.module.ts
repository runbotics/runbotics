import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstanceEvent } from './process-instance-event.entity';
import { ProcessInstanceEventService } from './process-instance-event.service';
import { ProcessInstanceEventController } from './process-instance-event.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstanceEvent])],
    controllers: [ProcessInstanceEventController],
    providers: [ProcessInstanceEventService],
    exports: [ProcessInstanceEventService],
})
export class ProcessInstanceEventModule {}

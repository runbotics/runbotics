import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessTriggerEntity } from './process-trigger.entity';
import { ProcessTriggerService } from './process-trigger.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessTriggerEntity])],
    exports: [ProcessTriggerService],
    providers: [ProcessTriggerService],
})
export class ProcessTriggerModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ProcessInstanceEntity} from './process-instance.entity';
import { ProcessInstanceService } from './process-instance.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstanceEntity])],
    exports: [TypeOrmModule, ProcessInstanceService],
    providers: [ProcessInstanceService],
})
export class ProcessInstanceModule {}
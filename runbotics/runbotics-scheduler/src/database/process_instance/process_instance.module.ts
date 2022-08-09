import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ProcessInstanceEntity} from './process_instance.entity';
import { ProcessInstanceService } from './process_instance.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstanceEntity])],
    exports: [TypeOrmModule, ProcessInstanceService],
    providers: [ProcessInstanceService],
})
export class ProcessInstanceModule {}
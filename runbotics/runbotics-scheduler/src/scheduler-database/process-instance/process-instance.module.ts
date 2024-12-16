import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstance } from './process-instance.entity';
import { ProcessInstanceService } from './process-instance.service';
import { ProcessInstanceController } from './process-instance.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessInstance])],
    controllers: [ProcessInstanceController],
    providers: [ProcessInstanceService],
    exports: [ProcessInstanceService],
})
export class ProcessInstanceModule {}

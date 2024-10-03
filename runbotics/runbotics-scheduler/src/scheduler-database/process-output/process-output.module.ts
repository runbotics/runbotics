import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessOutput } from './process-output.entity';
import { ProcessOutputController } from './process-output.controller';


@Module({
    imports: [TypeOrmModule.forFeature([ProcessOutput])],
    controllers: [ProcessOutputController],
})
export class ProcessOutputModule {}

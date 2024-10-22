import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '#/config/config.module';
import { ProcessOutputController } from '#/scheduler-database/process-output/process-output.controller';
import { ProcessOutput } from '#/scheduler-database/process-output/process-output.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessOutput]), ConfigModule],
    controllers: [ProcessOutputController],
})
export class ProcessOutputModule {}

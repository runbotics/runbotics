import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '#/config/config.module';
import { ProcessContext } from '#/scheduler-database/process-context/process-context.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessContext]), ConfigModule],
})
export class ProcessOutputModule {}

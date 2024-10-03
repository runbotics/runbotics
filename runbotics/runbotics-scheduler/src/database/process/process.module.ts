import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEntity } from './process.entity';
import { ProcessService } from './process.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessEntity])],
    exports: [ProcessService],
    providers: [ProcessService],
})
export class ProcessModule {}
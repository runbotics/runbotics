import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessSnapshotEntity } from './process-snapshot.entity';
import { ProcessSnapshotService } from './process-snapshot.service';
import { ProcessSnapshotController } from './process-snapshot.controller';
import { ProcessEntity } from '../process/process.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessSnapshotEntity, ProcessEntity]),
    ],
    exports: [ProcessSnapshotService],
    providers: [ProcessSnapshotService],
    controllers: [ProcessSnapshotController],
})
export class ProcessSnapshotModule {}

import { PrimaryColumn, Entity, OneToMany } from 'typeorm';
import { ProcessEntity } from '#/database/process/process.entity';
import { ProcessOutputType } from 'runbotics-common';

@Entity('process_output')
export class ProcessOutput {
    @PrimaryColumn('varchar', { length: 50 })
    type: ProcessOutputType;

    @OneToMany(() => ProcessEntity, process => process.outputType)
    processes: ProcessEntity[];
}

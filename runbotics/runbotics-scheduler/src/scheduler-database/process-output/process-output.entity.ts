import { ProcessOutputType } from 'runbotics-common';
import { Entity, PrimaryColumn } from 'typeorm';


@Entity({ name: 'process_output' })
export class ProcessOutput {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    type: ProcessOutputType;
}

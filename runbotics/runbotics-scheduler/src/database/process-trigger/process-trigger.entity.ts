import { IProcessTrigger, ProcessTrigger } from 'runbotics-common';
import { PrimaryColumn, Entity } from 'typeorm';

@Entity({ name: 'process_trigger' })
export class ProcessTriggerEntity implements IProcessTrigger {

    @PrimaryColumn({ type: 'varchar' })
        name: ProcessTrigger;
}
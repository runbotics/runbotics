import { PrimaryColumn, Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProcessEntity } from '#/database/process/process.entity';
import { ProcessContextSecret } from '#/database/process-context-secret/process-context-secret.entity';

@Entity()
export class ProcessContext {
    @PrimaryColumn({ type: 'bigint', generated: 'increment' })
    id: number;
    
    @OneToOne(() => ProcessEntity, process => process.context)
    @JoinColumn()
    process: ProcessEntity;
    
    @Column()
    processId: string;
    
    @OneToMany(() => ProcessContextSecret, processContextSecret => processContextSecret.processContextId)
    secrets: ProcessContextSecret[];
}

import { PrimaryColumn, Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ProcessContext } from '#/database/process-context/process-context.entity';
import { Secret } from '#/database/secret/secret.entity';

@Entity()
export class ProcessContextSecret {
    @PrimaryColumn({ type: 'bigint', generated: 'increment' })
    id: number;
    
    @Column()
    name: string;
    
    @ManyToOne(type => ProcessContext, processContext => processContext.secrets)
    processContext: ProcessContext;
    
    @Column()
    processContextId: string;
    
    @OneToOne(() => Secret, secret => secret.processContextSecret)
    @JoinColumn()
    secret: Secret;
    
    @Column()
    secretId: string;
}

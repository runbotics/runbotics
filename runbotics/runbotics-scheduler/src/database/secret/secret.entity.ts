import { PrimaryColumn, Entity, Column, OneToOne } from 'typeorm';
import { ProcessContextSecret } from '#/database/process-context-secret/process-context-secret.entity';

@Entity({ name: 'secret' })
export class Secret {
    @PrimaryColumn({ type: 'bigint', generated: 'increment' })
    id: number;
    
    @Column()
    tenantId: number;
    
    @Column()
    data: string;
    
    @Column()
    iv: string;
    
    @OneToOne(() => ProcessContextSecret, processContextSecret => processContextSecret.secret)
    processContextSecret: ProcessContextSecret | null;
}

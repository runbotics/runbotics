import { PrimaryColumn, Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { ProcessEntity } from '#/database/process/process.entity';
import { ProcessContextSecret } from '#/scheduler-database/process-context-secret/process-context-secret.entity';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';

@Entity({ schema: 'scheduler' })
export class ProcessContext {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    id: string;

    @ManyToOne(() => Tenant, tenant => tenant.secrets)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @OneToOne(() => ProcessEntity, process => process.context)
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    @Column('bigint', { name: 'process_id' })
    processId: number;

    @OneToMany(() => ProcessContextSecret, processContextSecret => processContextSecret.processContext)
    secrets: ProcessContextSecret[];
}

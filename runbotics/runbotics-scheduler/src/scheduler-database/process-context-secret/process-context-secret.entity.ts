import { PrimaryColumn, Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ProcessContext } from '#/scheduler-database/process-context/process-context.entity';
import { Secret } from '#/scheduler-database/secret/secret.entity';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';

@Entity({schema: 'scheduler'})
export class ProcessContextSecret {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    id: string;

    @Column('text')
    name: string;

    @ManyToOne(() => Tenant, tenant => tenant.processContextSecrets)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @ManyToOne(() => ProcessContext, processContext => processContext.secrets)
    @JoinColumn({ name: 'process_context_id' })
    processContext: ProcessContext;

    @Column('uuid', { name: 'process_context_id' })
    processContextId: string;

    @OneToOne(() => Secret, secret => secret.processContextSecret)
    @JoinColumn({ name: 'secret_id' })
    secret: Secret;

    @Column('uuid', { name: 'secret_id' })
    secretId: string;

    @Column('int')
    order: number;
}

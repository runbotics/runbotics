import { PrimaryColumn, Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ProcessContextSecret } from '#/database/process-context-secret/process-context-secret.entity';
import { Tenant } from '#/database/tenant/tenant.entity';

@Entity({ name: 'secret' })
export class Secret {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    id: string;

    @ManyToOne(() => Tenant, tenant => tenant.secrets)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @Column('text')
    data: string;

    @Column('text')
    iv: string;

    @OneToOne(() => ProcessContextSecret, processContextSecret => processContextSecret.secret)
    processContextSecret: ProcessContextSecret | null;
}

import { PrimaryColumn, Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ProcessContextSecret } from '#/scheduler-database/process-context-secret/process-context-secret.entity';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { CredentialAttribute } from '../credential-attribute/credential-attribute.entity';
@Entity({ name: 'secret', schema: 'scheduler' })
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

    @Column('text', { nullable: false })
    iv: string;

    @OneToOne(() => ProcessContextSecret, processContextSecret => processContextSecret.secret)
    processContextSecret: ProcessContextSecret | null;

    @OneToOne(() => CredentialAttribute, attribute => attribute.secret)
    attribute: CredentialAttribute;
}

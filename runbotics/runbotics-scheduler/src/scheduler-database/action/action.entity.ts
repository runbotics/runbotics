import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { ActionCredentialType, DEFAULT_TENANT_ID } from 'runbotics-common';

@Entity({ name: 'action' })
export class Action {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    label: string;

    @Column({ type: 'text' })
    form: string;

    @Column({ type: 'varchar', length: 255 })
    script: string;

    @Column({ type: 'varchar', length: 255, default: '' })
    credentialType: ActionCredentialType;

    @PrimaryColumn({
        name: 'tenant_id',
        type: 'uuid',
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.id)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}

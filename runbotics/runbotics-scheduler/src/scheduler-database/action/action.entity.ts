import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';


@Entity({ name: 'action' })
@Unique(['tenantId', 'id'])
export class Action {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    label: string;

    @Column({ type: 'text' })
    form: string;

    @Column({ type: 'varchar', length: 255 })
    script: string;

    @Column({ name: 'tenant_id', type: 'uuid', default: 'b7f9092f-5973-c781-08db-4d6e48f78e98' })
    tenantId: string;

    @ManyToOne(() => Tenant, tenant => tenant.id, { nullable: false })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}

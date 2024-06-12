import { PrimaryColumn, Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from '#/database/tenant/tenant.entity';

@Entity({ schema: 'scheduler' })
export class Attribute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name'  })
    name: string;

    @ManyToOne(() => Tenant, tenant => tenant.attributes)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;
}

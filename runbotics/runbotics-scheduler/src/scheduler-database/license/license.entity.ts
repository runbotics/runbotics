import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';

@Entity({ schema: 'scheduler' })
@Unique(['licenseKey', 'license', 'tenantId'])
export class License {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'plugin_name', type: 'varchar', length: 100 })
    pluginName: string;

    @Column({ name: 'tenant_id', type: 'uuid' })
    tenantId: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({ name: 'license_key', type: 'varchar', length: 255 })
    licenseKey: string;

    @Column({ type: 'varchar', length: 255 })
    license: string;

    @Column({ name: 'exp_date', type: 'date' })
    expDate: string;
}

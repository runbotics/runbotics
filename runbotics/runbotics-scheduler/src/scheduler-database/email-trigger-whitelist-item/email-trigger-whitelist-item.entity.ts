import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';

@Entity({ name: 'email_trigger_whitelist_item' })
@Unique(['whitelistItem', 'tenantId'])
export class EmailTriggerWhitelistItem {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'whitelist_item', type: 'varchar', length: 50 })
    whitelistItem: string;

    @Column({ name: 'tenant_id', type: 'uuid' })
    tenantId: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}

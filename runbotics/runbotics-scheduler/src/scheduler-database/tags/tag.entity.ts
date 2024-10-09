import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';

@Entity()
@Unique(['name', 'tenantId'])
export class Tag {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 20 })
    name: string;

    @Column({ name: 'tenant_id', type: 'uuid' })
    tenantId: string;

    @ManyToOne(() => Tenant, tenant => tenant.id, { nullable: false })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
    
    @ManyToMany(() => ProcessEntity, process => process.tags)
    processes: ProcessEntity[];
}

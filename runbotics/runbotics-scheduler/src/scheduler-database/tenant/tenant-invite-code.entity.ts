import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity()
export class TenantInviteCode {
    @PrimaryGeneratedColumn('uuid', { name: 'invite_id' })
    inviteId: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
    tenant: Tenant;

    @Column({ type: 'uuid', name: 'tenant_id' })
    tenantId: string;

    @Column({ type: 'timestamp without time zone', name: 'creation_date' })
    creationDate: Date;

    @Column({ type: 'timestamp without time zone', name: 'expiration_date' })
    expirationDate: Date;
}

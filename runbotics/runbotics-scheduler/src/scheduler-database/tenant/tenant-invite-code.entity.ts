import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public' })
export class TenantInviteCode {
    @PrimaryGeneratedColumn('uuid', { name: 'invite_id' })
    inviteId: string;

    @Column({ type: 'uuid', name: 'tenant_id' })
    tenantId: string;

    @Column({ type: 'timestamp without time zone', name: 'creation_date', nullable: false })
    creationDate: Date;

    @Column({ type: 'timestamp without time zone', name: 'expiration_date', nullable: false })
    expirationDate: Date;
}

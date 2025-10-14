import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookPayload } from '#/webhook/entities/webhook-payload.entity';

@Entity({ schema: 'scheduler' })
export class ClientRegistrationWebhook {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @Index()
    @Column({ type: 'uuid' })
    tenant_id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @Column({ type: 'varchar' })
    application_URL: string;

    @Index()
    @Column({ type: 'uuid', nullable: true })
    authorization_id: string | null;

    @Index()
    @Column({ type: 'uuid', nullable: true })
    client_registration_auth_id: string | null;

    @Index()
    @Column({ type: 'uuid', nullable: true })
    payload_id: string | null;

    @Column({ type: 'jsonb', nullable: true })
    registration_payload: unknown;

    @ManyToOne(() => Tenant, (tenant) => tenant.clientRegistrationWebhooks)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @OneToOne(() => WebhookAuthorization, (auth) => auth.clientRegistrationWebhook)
    @JoinColumn({ name: 'authorization_id' })
    authorization: WebhookAuthorization;

    @OneToOne(() => WebhookAuthorization, (auth) => auth.clientRegistrationClientWebhookForClient)
    @JoinColumn({ name: 'client_authorization_id' })
    clientAuthorization: WebhookAuthorization;

    @OneToOne(() => WebhookPayload, (payload) => payload.clientRegistrationWebhook)
    @JoinColumn({ name: 'payload_id' })
    payload: WebhookPayload;
}

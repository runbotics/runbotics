import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookPayload } from '#/webhook/entities/webhook-payload.entity';
import { dateTransformer } from '#/database/database.utils';

@Entity({ schema: 'scheduler' })
export class ClientRegistrationWebhook {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @Index()
    @Column({ type: 'uuid', name: 'tenant_id' })
    tenantId: string;

    @CreateDateColumn({ transformer: dateTransformer, type: 'timestamp without time zone', name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ transformer: dateTransformer, type: 'timestamp without time zone', name: 'updated_at', nullable: true })
    updatedAt: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @Column({ type: 'varchar', name: 'application_URL' })
    applicationURL: string;

    @Index()
    @Column({ type: 'uuid', name: 'authorization_id', nullable: true })
    authorizationId: string | null;

    @Index()
    @Column({ type: 'uuid', name: 'client_authorization_id', nullable: true })
    clientRegistrationAuthId: string | null;

    @Index()
    @Column({ type: 'uuid', name: 'payload_id', nullable: true })
    payloadId: string | null;

    @Column({ type: 'jsonb', name: 'registration_payload', nullable: true })
    registrationPayload: unknown;

    @ManyToOne(() => Tenant, (tenant) => tenant.clientRegistrationWebhooks)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @OneToOne(
        () => WebhookAuthorization,
        (auth) => auth.clientRegistrationWebhook,
    )
    @JoinColumn({ name: 'authorization_id' })
    authorization: WebhookAuthorization;

    @OneToOne(
        () => WebhookAuthorization, (auth) => auth.clientRegistrationClientWebhookForClient,
    )
    @JoinColumn({ name: 'client_authorization_id' })
    clientAuthorization: WebhookAuthorization;

    @OneToOne(
        () => WebhookPayload,
        (payload) => payload.clientRegistrationWebhook,
    )
    @JoinColumn({ name: 'payload_id' })
    payload: WebhookPayload;
}

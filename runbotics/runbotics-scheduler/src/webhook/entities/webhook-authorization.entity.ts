import { Column, Entity, Generated, OneToOne, PrimaryColumn } from 'typeorm';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { WebhookAuthorizationType } from 'runbotics-common';

@Entity({ schema: 'scheduler', name: 'webhook_authorization' })
export class WebhookAuthorization {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column({ type: 'enum', enum: WebhookAuthorizationType })
    type: WebhookAuthorizationType;

    @Column({ type: 'jsonb', nullable: true })
    data: Record<string, unknown>;

    @OneToOne(
        () => ClientRegistrationWebhook,
        (clientRegistrationWebhook) => clientRegistrationWebhook.authorization,
        { onDelete: 'CASCADE' },
    )
    clientRegistrationWebhook: ClientRegistrationWebhook;

    @OneToOne(
        () => ClientRegistrationWebhook,
        (clientRegistrationWebhook) => clientRegistrationWebhook.clientAuthorization,
        { onDelete: 'CASCADE' },
    )
    clientRegistrationClientWebhookForClient: ClientRegistrationWebhook;
}

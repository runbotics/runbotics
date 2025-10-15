import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';

@Entity({ schema: 'scheduler', name: 'webhook_payload' })
export class WebhookPayload {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column({ nullable: false })
    webhookIdPath: string;

    @Column({ nullable: false })
    payloadDataPath: string;

    @OneToOne(() => ClientRegistrationWebhook, (webhook) => webhook.payload, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'client_registration_webhook_id' })
    clientRegistrationWebhook: ClientRegistrationWebhook;

    @Column({ type: 'uuid', name: 'client_registration_webhook_id', nullable: true })
    clientRegistrationWebhookId: string;
}

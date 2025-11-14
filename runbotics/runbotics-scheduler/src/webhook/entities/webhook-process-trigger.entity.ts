import { Column, CreateDateColumn, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { dateTransformer, numberTransformer } from '#/database/database.utils';

@Entity({ schema: 'scheduler', name: 'webhook_process_trigger' })
@Unique(['tenantId', 'webhookId', 'processId'])
export class WebhookProcessTrigger {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid', name:'tenant_id' })
    tenantId: string;

    @Index()
    @Column({ type: 'uuid', name: 'webhook_id' })
    webhookId: string;

    @Index()
    @Column({ type: 'bigint', transformer: numberTransformer, name: 'process_id' })
    processId: number;

    @CreateDateColumn({ transformer: dateTransformer, type: 'timestamp without time zone', name: 'created_at' })
    createdAt: string;

    // Relations
    @ManyToOne(() => Tenant, (tenant) => tenant.webhookTriggers)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @ManyToOne(() => ClientRegistrationWebhook, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'webhook_id' })
    webhook: ClientRegistrationWebhook;

    @ManyToOne(() => ProcessEntity, (process) => process.webhookTriggers, { onDelete: 'CASCADE' } )
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;
}

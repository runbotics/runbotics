import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';

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
    @Column({ type: 'uuid', name: 'process_id' })
    processId: string;

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // Relations
    @ManyToOne(() => Tenant, (tenant) => tenant.webhookTriggers)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @ManyToOne(() => ClientRegistrationWebhook)
    @JoinColumn({ name: 'webhook_id' })
    webhook: ClientRegistrationWebhook;
    
    @ManyToOne(() => ProcessEntity, (process) => process.webhookTriggers, { onDelete: 'CASCADE' } )
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;
}

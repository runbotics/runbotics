import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';

@Entity({ schema: 'scheduler', name: 'webhook_process_trigger' })
@Unique(['tenant_id', 'webhook_id', 'process_id'])
export class WebhookProcessTrigger {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid' })
    tenant_id: string;

    @Index()
    @Column({ type: 'uuid' })
    webhook_id: string;

    @Index()
    @Column({ type: 'uuid' })
    process_id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

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

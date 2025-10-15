import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'scheduler' })
export class WebhookIncomingEventLog {
    @PrimaryColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column({ nullable: true })
    payload: string | null;

    @Column({ nullable: true })
    authorization: string | null;

    @Column({ nullable: true })
    status: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ nullable: true })
    error: string | null;
}

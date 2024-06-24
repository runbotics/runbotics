import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'scheduler' })
export class Tenant {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    id: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    name: string;

    @Column({ type: 'bigint', name: 'created_by' })
    createdById: number;

    @Column('timestamp with time zone')
    created: Date;

    @Column('timestamp with time zone')
    updated: Date;

    @Column({ type: 'varchar', name: 'last_modified_by', length: 50 })
    lastModifiedBy: string;
}

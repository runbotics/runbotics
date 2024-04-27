import { PrimaryColumn, Entity, Column } from 'typeorm';

@Entity({ name: 'secret' })
export class Secret {
    @PrimaryColumn({ type: 'bigint', generated: 'increment' })
    id: number;
    
    @Column()
    tenantId: number;
    
    @Column()
    data: string;
    
    @Column()
    iv: string;
}
